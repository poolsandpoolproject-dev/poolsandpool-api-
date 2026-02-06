import vine from '@vinejs/vine'

export const createSectionValidator = vine.compile(
  vine.object({
    categoryId: vine.string().trim().minLength(1),
    name: vine.string().trim().minLength(1),
    description: vine.string().trim().optional(),
    imageUrl: vine.string().trim().url().optional(),
    order: vine.number().optional(),
    enabled: vine.boolean().optional(),
  })
)

export const updateSectionValidator = vine.compile(
  vine.object({
    categoryId: vine.string().trim().minLength(1).optional(),
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

export const reorderSectionsValidator = vine.compile(
  vine.object({
    categoryId: vine.string().trim().minLength(1),
    sectionIds: vine.array(vine.string().trim().minLength(1)).minLength(1),
  })
)

