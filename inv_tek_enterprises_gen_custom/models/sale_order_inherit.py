from odoo import models, fields, api


class SaleOrderInherit(models.Model):
    _inherit = 'sale.order'

    @api.onchange('partner_id')
    def _onchange_partner_id(self):
        for rec in self:
            if rec.partner_id:
                pricelist = self.env['product.pricelist'].search([
                    ('partner_id', '=', rec.partner_id.id)
                ], limit=1)

                if pricelist:
                    rec.pricelist_id = pricelist.id
                else:
                    rec.pricelist_id = rec.partner_id.property_product_pricelist.id


class SaleOrderLineInherit(models.Model):
    _inherit = 'sale.order.line'

    category_id = fields.Many2one('product.category', 'Category')
    brand_id = fields.Many2one('brand.name', 'Brand')


class PriceListInherit(models.Model):
    _inherit = 'product.pricelist'

    partner_id = fields.Many2one('res.partner', 'Partner')
