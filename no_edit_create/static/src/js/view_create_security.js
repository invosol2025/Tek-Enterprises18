/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { session } from "@web/session";
import { FormController } from "@web/views/form/form_controller";
import { KanbanController } from "@web/views/kanban/kanban_controller";
import { ListController } from "@web/views/list/list_controller";

function canUseNewButton() {
    return Boolean(session.no_edit_create_can_use_new_button);
}

patch(ListController.prototype, {
    setup() {
        super.setup(...arguments);
        if (!canUseNewButton()) {
            this.activeActions.create = false;
        }
    },

    async createRecord() {
        if (!canUseNewButton()) {
            return;
        }
        return super.createRecord(...arguments);
    },
});

patch(FormController.prototype, {
    setup() {
        super.setup(...arguments);
        if (!canUseNewButton()) {
            this.canCreate = false;
        }
    },

    async create() {
        if (!canUseNewButton()) {
            return;
        }
        return super.create(...arguments);
    },
});

patch(KanbanController.prototype, {
    get canCreate() {
        return canUseNewButton() && super.canCreate;
    },

    async createRecord() {
        if (!canUseNewButton()) {
            return;
        }
        return super.createRecord(...arguments);
    },
});
