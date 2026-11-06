-- Apply migrations/202611070001_test_order.sql and release the updated frontend first.
-- Convert the existing account only; preserve its login, company details, and settings.
begin;

-- At most one company may be the Testing Account.
create unique index if not exists companies_single_test_account_idx
  on public.companies (is_test_account) where is_test_account;

do $$
begin
  update public.companies
  set is_test_account = true
  where lower(email) = 'ziyamohd123@gmail.com';

  if not found then
    raise exception 'Existing account ziyamohd123@gmail.com was not found. No account was created.';
  end if;
end;
$$;

commit;

select c.company_name, c.email, c.is_test_account
from public.companies c
where lower(c.email) = 'ziyamohd123@gmail.com';
