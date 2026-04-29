/** @odoo-module **/

import { registry } from "@web/core/registry";
import { session } from "@web/session";
import { many2OneField } from "@web/views/fields/many2one/many2one_field";
import { many2OneBarcodeField } from "@web/views/fields/many2one_barcode/many2one_barcode_field";
import { productLabelSectionAndNoteField } from "@account/components/product_label_section_and_note_field/product_label_section_and_note_field";
import "@account/components/account_many2one_barcode/account_many2one_barcode";
import "@partner_autocomplete/js/partner_autocomplete_many2one";
import { saleOrderLineProductField } from "@sale/js/sale_product_field";

function withoutEditCreate(field) {
    return {
        ...field,
        extractProps(fieldInfo, dynamicInfo) {
            const props = field.extractProps(fieldInfo, dynamicInfo);

            return {
                ...props,
                canOpen: false,
                canCreate: false,
                canWrite: false,
                canQuickCreate: false,
                canCreateEdit: false,
            };
        },
    };
}

const noEditCreateMany2OneField = withoutEditCreate(many2OneField);
const noEditCreateMany2OneBarcodeField = withoutEditCreate(many2OneBarcodeField);
const noEditCreateProductLabelSectionAndNoteField = withoutEditCreate(
    productLabelSectionAndNoteField
);
const noEditCreateAccountMany2OneBarcodeField = withoutEditCreate(
    registry.category("fields").get("account_many2one_barcode")
);
const noEditCreateSaleOrderLineProductField = withoutEditCreate(saleOrderLineProductField);

if (!session.no_edit_create_can_create_edit) {
    registry.category("fields").add("many2one", noEditCreateMany2OneField, { force: true });
    registry.category("fields").add("list.many2one", noEditCreateMany2OneField, { force: true });
    registry.category("fields").add("kanban.many2one", noEditCreateMany2OneField, { force: true });
    registry.category("fields").add("many2one_barcode", noEditCreateMany2OneBarcodeField, {
        force: true,
    });
    registry
        .category("fields")
        .add("account_many2one_barcode", noEditCreateAccountMany2OneBarcodeField, { force: true });
    registry.category("fields").add(
        "product_label_section_and_note_field",
        noEditCreateProductLabelSectionAndNoteField,
        { force: true }
    );
    registry.category("fields").add("res_partner_many2one", noEditCreateMany2OneField, {
        force: true,
    });
    registry
        .category("fields")
        .add("sol_product_many2one", noEditCreateSaleOrderLineProductField, { force: true });
}