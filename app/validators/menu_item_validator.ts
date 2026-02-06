import vine from '@vinejs/vine'

export const createMenuItemValidator = vine.compile(
  vine.object({
    categoryId: vine.string().trim().minLength(1),
    sectionId: vine.string().trim().minLength(1),
    name: vine.string().trim().minLength(1),
    description: vine.string().trim().optional(),
    basePrice: vine.number().min(0),
    imageUrl: vine.string().trim().url().optional(),
    available: vine.boolean().optional(),
    enabled: vine.boolean().optional(),
  })
)

export const updateMenuItemValidator = vine.compile(
  vine.object({
    categoryId: vine.string().trim().minLength(1).optional(),
    sectionId: vine.string().trim().minLength(1).optional(),
    name: vine.string().trim().minLength(1).optional(),
    description: vine.string().trim().nullable().optional(),
    basePrice: vine.number().min(0).optional(),
    imageUrl: vine.string().trim().url().nullable().optional(),
    available: vine.boolean().optional(),
    enabled: vine.boolean().optional(),
  })
)

export const setAvailabilityValidator = vine.compile(
  vine.object({
    available: vine.boolean(),
  })
)

export const setEnabledValidator = vine.compile(
  vine.object({
    enabled: vine.boolean(),
  })
)
