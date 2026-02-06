import vine from '@vinejs/vine'

export const createTemporaryPriceValidator = vine.compile(
  vine.object({
    ruleName: vine.string().trim().minLength(1),
    price: vine.number().min(0),
    startAt: vine.date(),
    endAt: vine.date(),
    enabled: vine.boolean().optional(),
  })
)

export const updateTemporaryPriceValidator = vine.compile(
  vine.object({
    ruleName: vine.string().trim().minLength(1).optional(),
    price: vine.number().min(0).optional(),
    startAt: vine.date().optional(),
    endAt: vine.date().optional(),
    enabled: vine.boolean().optional(),
  })
)

export const setEnabledValidator = vine.compile(
  vine.object({
    enabled: vine.boolean(),
  })
)
