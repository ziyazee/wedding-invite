-- Apply after 202610200002_order_sale_price.sql.
-- Clients may set their final selling price, including zero for complimentary.
-- Existing orders and their historical prices are left unchanged.
begin;

create or replace function public.snapshot_order_sale_price()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.price is not null then
    if new.price < 0 or new.price::text in ('NaN', 'Infinity', '-Infinity') then
      raise exception 'Selling price must be a finite, non-negative amount.';
    end if;
    -- Preserve an explicitly entered amount, including zero.
    return new;
  end if;

  -- Older clients that omit price still get the saved template selling price.
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
-- Existing row-level policies continue to restrict inserts to the user's company.
grant insert (price) on public.orders to authenticated;

comment on column public.orders.price is
  'Final INR selling price captured at creation, including custom amounts; zero is complimentary; NULL is unknown. Independent of later template price changes.';

commit;
