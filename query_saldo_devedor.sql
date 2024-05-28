select
  round(
    (
      select
        sum(value)
      from
        payment
      where
        status = 'accepted'
        and payment_method_id = 5
        and (
          user_id in (
            select
              affiliated_id
            from
              affiliation
            where
              affiliator_id = user.id
          )
          or user_id = user.id
        )
        and (
          not is_paypayroll
          or is_paypayroll is null
        )
    ) - (
      select
        sum(value)
      from
        payment
      where
        status = 'accepted'
        and user_id = user.id
        and (
          is_paypayroll
          and is_paypayroll is not null
        )
    ),
    2
  ) as saldo_devedor,
  user.username,
  user.balance_payroll
from
  user
where
  round(user.balance_payroll, 2) != saldo_devedor;