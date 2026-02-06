import vine from '@vinejs/vine'

export const createCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    description: vine.string().trim().optional(),
    imageUrl: vine.string().trim().url().optional(),
    order: vine.number().optional(),
    enabled: vine.boolean().optional(),
  })
)

export const updateCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).optional(),
    description: vine.string().trim().nullable().optional(),
    imageUrl: vine.string().trim().url().nullable().optional(),
    order: vine.number().optional(),
    enabled: vine.boolean().optional(),
  })
)

export const setEnabledValidator = vine.compile(
  vine.object({
    enabled: vine.boolean(),
  })
)

export const reorderCategoriesValidator = vine.compile(
  vine.object({
    categoryIds: vine.array(vine.string().trim().minLength(1)).minLength(1),
  })
)

