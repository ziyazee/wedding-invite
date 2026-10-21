-- Snapshot the company's saved selling price when an order is created.
-- Historical orders remain NULL: current settings are not evidence of their
-- original sale price. Confirmed historical prices can be entered separately.
begin;

alter table public.orders
  add column if not exists price numeric(12,2)
  check (price is null or price >= 0);

create or replace function public.snapshot_order_sale_price()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Always derive the snapshot from saved settings, not a client-supplied price.
  -- No settings row means unknown (NULL), whereas an explicit zero means free.
  new.price := (
    select round(
      case s.sale_type
        when 'percentage' then s.price * (1 - s.sale_value / 100)
        when 'fixed' then s.price - s.sale_value
        else s.price
      end,
      2
    )
    from public.company_template_settings s
    join public.invitation_templates t on t.id = s.template_id
    where s.company_id = new.company_id
      and t.template_code = new.template_code
  );
  return new;
end;
$$;

revoke all on function public.snapshot_order_sale_price() from public;

drop trigger if exists orders_snapshot_sale_price on public.orders;
create trigger orders_snapshot_sale_price
before insert on public.orders
for each row execute function public.snapshot_order_sale_price();

comment on column public.orders.price is
  'INR selling price after discounts, captured at order creation; NULL means no historical price is recorded.';

commit;
