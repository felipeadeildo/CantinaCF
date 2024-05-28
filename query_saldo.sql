select
  round(
    (
      (
        select
          sum(value)
        from
          payment
        where
          user_id = user.id
          and status = 'accepted'
          and (
            is_paypayroll is null
            or not is_paypayroll
          )
      ) - (
        select
          sum(value)
        from
          product_sale
        where
          sold_to = user.id
      )
    ),
    2
  ) as saldo_calculado,
  user.username,
  user.balance
from
  user
where
  saldo_calculado != round(user.balance, 2);