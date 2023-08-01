import json
from odoo import http
from odoo.http import request
from odoo.exceptions import ValidationError


class WebsiteSlidesSnippets(http.Controller):
    @http.route(['/website_slides/get_slides'], type="json", auth="public")
    def get_slides(self, domain=None, **kwargs):
        try:
            if domain:
                slides_obj = request.env['slide.channel'].search(domain)
            else:
                slides_obj = request.env['slide.channel'].search([])
            slides = slides_obj.read(['id', 'name', 'image_1920'])
            for slide in slides:
                if slide.get('image_1920'):
                    slide['image'] = slide.get('image_1920')
                    slide.pop('image_1920', None)
                else:
                    slide['image'] = False
            return slides
        except ValidationError as e:
            error_message = {'error': str(e)}
            return request.make_response(json.dumps(error_message), headers=[('Content-Type', 'application/json')])
