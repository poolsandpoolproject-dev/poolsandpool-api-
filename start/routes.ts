/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { openapi } from '#start/openapi'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

const AuthController = () => import('#controllers/auth_controller')
const AdminCategoriesController = () => import('#controllers/Admin/categories_controller')
const AdminUploadsController = () => import('#controllers/Admin/uploads_controller')
const AdminSectionsController = () => import('#controllers/Admin/sections_controller')
const AdminMenuItemsController = () => import('#controllers/Admin/menu_items_controller')

router
  .group(() => {
    router.get('openapi.json', async () => openapi)

    router.get('docs', async () => {
      return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/api/v1/openapi.json',
        dom_id: '#swagger-ui'
      })
    </script>
  </body>
</html>`
    })

    router.get('public/ping', async () => {
      return { ok: true }
    })

    router.post('auth/login', [AuthController, 'login'])
    router
      .post('auth/logout', [AuthController, 'logout'])
      .use([middleware.auth({ guards: ['api'] })])
    router.get('auth/me', [AuthController, 'me']).use([middleware.auth({ guards: ['api'] })])

    router
      .group(() => {
        router.post('uploads/images', [AdminUploadsController, 'image'])

        router.get('categories', [AdminCategoriesController, 'index'])
        router.get('categories/:id', [AdminCategoriesController, 'show'])
        router.post('categories', [AdminCategoriesController, 'store'])
        router.patch('categories/:id', [AdminCategoriesController, 'update'])
        router.post('categories/reorder', [AdminCategoriesController, 'reorder'])
        router.patch('categories/:id/enabled', [AdminCategoriesController, 'setEnabled'])

        router.get('sections', [AdminSectionsController, 'index'])
        router.get('sections/:id', [AdminSectionsController, 'show'])
        router.post('sections', [AdminSectionsController, 'store'])
        router.patch('sections/:id', [AdminSectionsController, 'update'])
        router.post('sections/reorder', [AdminSectionsController, 'reorder'])
        router.patch('sections/:id/enabled', [AdminSectionsController, 'setEnabled'])

        router.get('menu-items', [AdminMenuItemsController, 'index'])
        router.get('menu-items/:id', [AdminMenuItemsController, 'show'])

        router.get('ping', async ({ auth }) => {
          return {
            ok: true,
            user: auth.user,
          }
        })
      })
      .prefix('admin')
      .use([middleware.auth({ guards: ['api'] }), middleware.requireRole({ roles: ['admin'] })])
  })
  .prefix('api/v1')
