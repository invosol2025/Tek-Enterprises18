/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { user } from "@web/core/user";
import { useService } from "@web/core/utils/hooks";
import { FormController } from "@web/views/form/form_controller";
import { ListController } from "@web/views/list/list_controller";
import { KanbanController } from "@web/views/kanban/kanban_controller";
import { Many2OneField } from "@web/views/fields/many2one/many2one_field";
import { Many2ManyTagsField } from "@web/views/fields/many2many_tags/many2many_tags_field";
import { Many2XAutocomplete } from "@web/views/fields/relational_utils";

import { onWillStart, useEffect } from "@odoo/owl";

const ACCESS_GROUP = "tek_hide_create_edit.group_access_create_edit";
const RELATIONAL_ACCESS_GROUP = "tek_hide_create_edit.group_access_relational_create_edit";

let createEditAccessPromise;
let relationalCreateEditAccessPromise;
const modelBaseCache = new Map();

function hasCreateEditAccess() {
    if (!createEditAccessPromise) {
        createEditAccessPromise = user.hasGroup(ACCESS_GROUP);
    }
    return createEditAccessPromise;
}

function hasRelationalCreateEditAccess() {
    if (!relationalCreateEditAccessPromise) {
        relationalCreateEditAccessPromise = user.hasGroup(RELATIONAL_ACCESS_GROUP);
    }
    return relationalCreateEditAccessPromise;
}

async function isBaseModuleModel(orm, resModel) {
    if (!orm || !resModel) {
        return false;
    }
    if (!modelBaseCache.has(resModel)) {
        modelBaseCache.set(
            resModel,
            orm
                .searchRead("ir.model", [["model", "=", resModel]], ["modules"], { limit: 1 })
                .then((records) => {
                    const modules = records[0]?.modules || "";
                    return modules
                        .split(",")
                        .map((moduleName) => moduleName.trim())
                        .includes("base");
                })
                .catch(() => false)
        );
    }
    return modelBaseCache.get(resModel);
}

function disableCreateActions(activeActions) {
    if (!activeActions) {
        return;
    }
    if ("create" in activeActions) {
        activeActions.create = false;
    }
    if ("createEdit" in activeActions) {
        activeActions.createEdit = false;
    }
}

function disableRelationalActions(activeActions) {
    if (!activeActions) {
        return;
    }
    disableCreateActions(activeActions);
    if ("write" in activeActions) {
        activeActions.write = false;
    }
}

function filterCreateOptions(options) {
    return options.filter((option) => {
        const classList = option.classList || "";
        return (
            !classList.includes("o_m2o_dropdown_option_create") &&
            !classList.includes("o_m2o_dropdown_option_create_edit") &&
            !classList.includes("o_m2o_start_typing")
        );
    });
}

function disableViewActions(activeActions) {
    if (!activeActions) {
        return;
    }
    disableCreateActions(activeActions);
    if ("edit" in activeActions) {
        activeActions.edit = false;
    }
    if ("link" in activeActions) {
        activeActions.link = false;
    }
    if ("write" in activeActions) {
        activeActions.write = false;
    }
}

function isToManyDialogForm(component) {
    return component.env.inDialog && component.props.buttonTemplate === "web.FormViewDialog.ToMany.buttons";
}

patch(FormController.prototype, {
    setup() {
        super.setup(...arguments);
        onWillStart(async () => {
            const allowed = await hasCreateEditAccess();
            const exemptModel = await isBaseModuleModel(this.orm, this.props.resModel);
            const exemptToManyDialog = isToManyDialogForm(this);
            this._hideCreateEditRestricted = !allowed && !exemptModel && !exemptToManyDialog;
            if (this._hideCreateEditRestricted) {
                this.canCreate = false;
                this.canEdit = false;
                disableViewActions(this.archInfo?.activeActions);
            }
        });
    },
});

patch(ListController.prototype, {
    setup() {
        super.setup(...arguments);
        this.orm = useService("orm");
        onWillStart(async () => {
            const allowed = await hasCreateEditAccess();
            const exemptModel = await isBaseModuleModel(this.orm, this.props.resModel);
            this._hideCreateEditRestricted = !allowed && !exemptModel;
            if (this._hideCreateEditRestricted) {
                this.editable = false;
                disableViewActions(this.activeActions);
            }
        });
    },
});

patch(KanbanController.prototype, {
    setup() {
        super.setup(...arguments);
        this.orm = useService("orm");
        onWillStart(async () => {
            const allowed = await hasCreateEditAccess();
            const exemptModel = await isBaseModuleModel(this.orm, this.props.resModel);
            this._hideCreateEditRestricted = !allowed && !exemptModel;
            if (this._hideCreateEditRestricted) {
                disableViewActions(this.props.archInfo?.activeActions);
            }
        });
    },

    get canCreate() {
        if (this._hideCreateEditRestricted) {
            return false;
        }
        return super.canCreate;
    },

    async openRecord(record, mode) {
        if (this._hideCreateEditRestricted) {
            mode = "readonly";
        }
        return super.openRecord(record, mode);
    },
});

patch(Many2OneField.prototype, {
    setup() {
        super.setup(...arguments);
        onWillStart(async () => {
            const allowed = await hasRelationalCreateEditAccess();
            const exemptModel = await isBaseModuleModel(this.orm, this.relation);
            this._hideCreateEditRestricted = !allowed && !exemptModel;
            if (this._hideCreateEditRestricted) {
                this.quickCreate = null;
                disableRelationalActions(this.state.activeActions);
            }
        });
        useEffect(
            () => {
                if (this._hideCreateEditRestricted) {
                    this.quickCreate = null;
                    disableRelationalActions(this.state.activeActions);
                }
            },
            () => [this._hideCreateEditRestricted, this.props.readonly, this.props.value]
        );
    },

    computeActiveActions(props) {
        super.computeActiveActions(props);
        if (this._hideCreateEditRestricted) {
            disableRelationalActions(this.state.activeActions);
        }
    },

    get Many2XAutocompleteProps() {
        const props = super.Many2XAutocompleteProps;
        if (this._hideCreateEditRestricted) {
            props.activeActions = {
                ...props.activeActions,
                create: false,
                createEdit: false,
                write: false,
            };
            props.quickCreate = null;
            props.canOpen = false;
        }
        return props;
    },

    get hasExternalButton() {
        if (this._hideCreateEditRestricted) {
            return false;
        }
        return super.hasExternalButton;
    },
});

patch(Many2ManyTagsField.prototype, {
    setup() {
        super.setup(...arguments);
        onWillStart(async () => {
            const allowed = await hasRelationalCreateEditAccess();
            const exemptModel = await isBaseModuleModel(this.orm, this.relation);
            this._hideCreateEditRestricted = !allowed && !exemptModel;
            if (this._hideCreateEditRestricted) {
                this.quickCreate = null;
                disableRelationalActions(this.activeActions);
            }
        });
        useEffect(
            () => {
                if (this._hideCreateEditRestricted) {
                    this.quickCreate = null;
                    disableRelationalActions(this.activeActions);
                }
            },
            () => [this._hideCreateEditRestricted, this.props.readonly, this.tags.length]
        );
    },
});

patch(Many2XAutocomplete.prototype, {
    setup() {
        super.setup(...arguments);
        onWillStart(async () => {
            const allowed = await hasRelationalCreateEditAccess();
            const exemptModel = await isBaseModuleModel(this.orm, this.props.resModel);
            this._hideCreateEditRestricted = !allowed && !exemptModel;
            if (this._hideCreateEditRestricted) {
                if (this.props.activeActions) {
                    disableRelationalActions(this.props.activeActions);
                }
                this.props.quickCreate = null;
            }
        });
        useEffect(
            () => {
                if (this._hideCreateEditRestricted) {
                    if (this.props.activeActions) {
                        disableRelationalActions(this.props.activeActions);
                    }
                    this.props.quickCreate = null;
                }
            },
            () => [
                this._hideCreateEditRestricted,
                this.props.resModel,
                this.props.value,
                Boolean(this.props.quickCreate),
            ]
        );
    },

    get activeActions() {
        const activeActions = super.activeActions;
        if (!this._hideCreateEditRestricted) {
            return activeActions;
        }
        return {
            ...activeActions,
            create: false,
            createEdit: false,
            write: false,
        };
    },

    async loadOptionsSource(request) {
        if (this._hideCreateEditRestricted) {
            this.props.quickCreate = null;
            if (this.props.activeActions) {
                disableRelationalActions(this.props.activeActions);
            }
        }
        const options = await super.loadOptionsSource(request);
        if (!this._hideCreateEditRestricted) {
            return options;
        }
        return filterCreateOptions(options);
    },

    async onSearchMore(request) {
        if (this._hideCreateEditRestricted && this.props.activeActions) {
            disableRelationalActions(this.props.activeActions);
        }
        return super.onSearchMore(request);
    },
});
