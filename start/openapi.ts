export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Pools & Pool Lounge Menu API',
    version: '1.0.0',
  },
  servers: [{ url: '/api/v1' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
  paths: {
    '/public/ping': {
      get: {
        tags: ['public'],
        responses: {
          200: {
            description: 'OK',
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/admin/ping': {
      get: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/admin/categories': {
      get: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'includeDisabled', in: 'query', required: false, schema: { type: 'boolean', default: true } },
          { name: 'enabled', in: 'query', required: false, schema: { type: 'boolean' }, description: 'Filter by enabled (true/false)' },
          { name: 'search', in: 'query', required: false, schema: { type: 'string' }, description: 'Search in name and description (case-insensitive)' },
          { name: 'page', in: 'query', required: false, schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'perPage', in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
        ],
        responses: {
          200: { description: 'OK (paginated: data + meta)' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
      post: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  imageUrl: { type: 'string', nullable: true },
                  order: { type: 'number' },
                  enabled: { type: 'boolean' },
                },
              },
            },
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  image: { type: 'string', format: 'binary' },
                  order: { type: 'number' },
                  enabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Created' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/admin/categories/{id}': {
      get: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Not found' },
        },
      },
      patch: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  imageUrl: { type: 'string', nullable: true },
                  order: { type: 'number' },
                  enabled: { type: 'boolean' },
                },
              },
            },
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  image: { type: 'string', format: 'binary' },
                  order: { type: 'number' },
                  enabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Not found' },
        },
      },
    },
    '/admin/categories/reorder': {
      post: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['categoryIds'],
                properties: {
                  categoryIds: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/admin/categories/{id}/enabled': {
      patch: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['enabled'],
                properties: { enabled: { type: 'boolean' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Not found' },
        },
      },
    },
    '/admin/uploads/images': {
      post: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Created' },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          422: { description: 'Unprocessable entity' },
          500: { description: 'Server error' },
        },
      },
    },
    '/admin/sections': {
      get: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'categoryId', in: 'query', required: false, schema: { type: 'string' }, description: 'Filter by category UUID' },
          { name: 'includeDisabled', in: 'query', required: false, schema: { type: 'boolean', default: true }, description: 'If false, only return enabled sections' },
          { name: 'enabled', in: 'query', required: false, schema: { type: 'boolean' }, description: 'Filter by enabled (true/false)' },
          { name: 'search', in: 'query', required: false, schema: { type: 'string' }, description: 'Search in name and description (case-insensitive)' },
          { name: 'page', in: 'query', required: false, schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'perPage', in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
        ],
        responses: {
          200: { description: 'OK (paginated: data + meta)' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
      post: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['categoryId', 'name'],
                properties: {
                  categoryId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  imageUrl: { type: 'string', nullable: true },
                  order: { type: 'number' },
                  enabled: { type: 'boolean' },
                },
              },
            },
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['categoryId', 'name'],
                properties: {
                  categoryId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  image: { type: 'string', format: 'binary' },
                  order: { type: 'number' },
                  enabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Created' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/admin/sections/{id}': {
      get: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Not found' },
        },
      },
      patch: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  categoryId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  imageUrl: { type: 'string', nullable: true },
                  order: { type: 'number' },
                  enabled: { type: 'boolean' },
                },
              },
            },
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  categoryId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  image: { type: 'string', format: 'binary' },
                  order: { type: 'number' },
                  enabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Not found' },
        },
      },
    },
    '/admin/sections/reorder': {
      post: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['categoryId', 'sectionIds'],
                properties: {
                  categoryId: { type: 'string' },
                  sectionIds: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/admin/sections/{id}/enabled': {
      patch: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['enabled'],
                properties: { enabled: { type: 'boolean' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Not found' },
        },
      },
    },
    '/admin/menu-items': {
      get: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'categoryId', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'sectionId', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'search', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'includeDisabled', in: 'query', required: false, schema: { type: 'boolean', default: true } },
          { name: 'available', in: 'query', required: false, schema: { type: 'boolean' } },
          { name: 'enabled', in: 'query', required: false, schema: { type: 'boolean' } },
          { name: 'page', in: 'query', required: false, schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'perPage', in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
        ],
        responses: { 200: { description: 'OK (paginated)' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' } },
      },
      post: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['categoryId', 'sectionId', 'name', 'basePrice'],
                properties: {
                  categoryId: { type: 'string' },
                  sectionId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  basePrice: { type: 'number' },
                  imageUrl: { type: 'string' },
                  available: { type: 'boolean' },
                  enabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' } },
      },
    },
    '/admin/menu-items/{id}': {
      get: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  categoryId: { type: 'string' },
                  sectionId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  basePrice: { type: 'number' },
                  imageUrl: { type: 'string', nullable: true },
                  available: { type: 'boolean' },
                  enabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
    },
    '/admin/menu-items/{id}/availability': {
      patch: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', required: ['available'], properties: { available: { type: 'boolean' } } },
            },
          },
        },
        responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
    },
    '/admin/menu-items/{id}/enabled': {
      patch: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', required: ['enabled'], properties: { enabled: { type: 'boolean' } } },
            },
          },
        },
        responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
    },
    '/admin/menu-items/{menuItemId}/temporary-prices': {
      get: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'menuItemId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'OK (list with status: ACTIVE|UPCOMING|EXPIRED)' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
      post: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'menuItemId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['ruleName', 'price', 'startAt', 'endAt'],
                properties: {
                  ruleName: { type: 'string' },
                  price: { type: 'number' },
                  startAt: { type: 'string', format: 'date-time' },
                  endAt: { type: 'string', format: 'date-time' },
                  enabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
    },
    '/admin/menu-items/{menuItemId}/temporary-prices/{id}': {
      patch: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'menuItemId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ruleName: { type: 'string' },
                  price: { type: 'number' },
                  startAt: { type: 'string', format: 'date-time' },
                  endAt: { type: 'string', format: 'date-time' },
                  enabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'menuItemId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
    },
    '/admin/menu-items/{menuItemId}/temporary-prices/{id}/enabled': {
      patch: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'menuItemId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', required: ['enabled'], properties: { enabled: { type: 'boolean' } } },
            },
          },
        },
        responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
    },
    '/admin/menu-items/{menuItemId}/temporary-prices/{id}/duplicate': {
      post: {
        tags: ['admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'menuItemId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { 201: { description: 'Created (copy with enabled: false)' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
    },
  },
} as const

