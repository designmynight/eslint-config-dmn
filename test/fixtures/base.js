export function count() {
  let value = 0
  value++
  return value + later()
}

function later() {
    return "two"
}

// This intentionally long comment verifies that the DMN max-len rule remains a warning at one hundred and twenty characters rather than Airbnb's lower limit.
