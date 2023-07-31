import json
from odoo import http
from odoo.http import request
from odoo.exceptions import ValidationError


class ECommerceSnippets(http.Controller):
    @http.route(['/e_commerce/get_product_categories'], type="json", auth="public")
    def product_category(self, domain=None, **kwargs):
        try:
            if domain:
                category_obj = request.env['product.public.category'].search(
                    domain)
            else:
                category_obj = request.env['product.public.category'].search([
                ])

            categories = category_obj.read(['id', 'name', 'image_1920'])

            for category in categories:
                if category.get('image_1920'):
                    category['image'] = category.get('image_1920')
                    category.pop('image_1920', None)
                else:
                    category['image'] = False

                category['website_url'] = f"/shop/category/{category.get('id')}"

            return categories

        except ValidationError as e:
            error_message = {'error': str(e)}
            return request.make_response(json.dumps(error_message), headers=[('Content-Type', 'application/json')])

    @http.route(['/e_commerce/get_product_categories_row'], type="json", auth="public")
    def product_category_row(self, domain=None, **kwargs):
        try:
            if domain:
                category_obj = request.env['product.public.category'].search(
                    domain, order='id asc')
            else:
                category_obj = request.env['product.public.category'].search(
                    [], order='id asc')

            categories = category_obj.read(['name'])

            response = []

            for category in categories:
                product_obj = request.env['product.template'].search(
                    [('public_categ_ids', 'in', [category['id']])], limit=15, order="id asc")
                products = product_obj.read(
                    ['name', 'list_price', 'image_1920', 'website_url'])

                for product in products:
                    if product.get('image_1920'):
                        product['image'] = product.get('image_1920')
                        product.pop('image_1920', None)
                    else:
                        category['image'] = False

                response.append({
                    'category_id': category['id'],
                    'category_name': category['name'],
                    'products': products
                })

            return response

        except ValidationError as e:
            error_message = {'error': str(e)}
            return request.make_response(json.dumps(error_message), headers=[('Content-Type', 'application/json')])
