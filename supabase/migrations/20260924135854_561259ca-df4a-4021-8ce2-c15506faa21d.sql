with bad as (
 select p.business_id, lower(p.email) em from public.businesses_private p join public.businesses b on b.id=p.business_id
 where p.email is not null and b.claim_status is distinct from 'claimed' and (
  lower(p.email) ~ '(test|qa\+|example\.|sample|demo@)'
  or split_part(lower(p.email),'@',2) in ('1325.ai','mansamusamarketplace.com','mansamusa.com','nogreenthumb.com','godaddy.com','blackbusiness.com','urbanmatter.com','dekalbchamp.com','wix.com','squarespace.com','sentry.io','domain.com','email.com')
  or lower(p.email) !~ '^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$'))
, ins as (insert into public.claim_email_optouts(email) select distinct em from bad on conflict (email) do nothing)
update public.businesses_private p set email=null, email_check_result='removed_bad_email' from bad where p.business_id=bad.business_id;