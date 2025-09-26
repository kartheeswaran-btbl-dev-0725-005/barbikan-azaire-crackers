const Joi = require('joi');

const createGroupBySchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),
	group_by: Joi.string().required(),
	status: Joi.string().valid('active', 'inactive', 'deleted').default('active'),
});

const updateGroupBySchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),
	group_by: Joi.string().optional(),
	status: Joi.string().valid('active', 'inactive', 'deleted').default('active'),
});

module.exports = {
	createGroupBySchema,
	updateGroupBySchema,
};
