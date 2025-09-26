const Joi = require('joi');

exports.createInvitationSchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),
	inviteEmail: Joi.string().email().required().messages({
		'string.email': 'Invalid email format',
		'any.required': 'Invite email is required',
	}),
	inviteRole: Joi.string()
		.valid('admin', 'manager', 'staff', 'viewer')
		.default('viewer')
		.messages({
			'any.only': 'Role must be one of: admin, manager, staff, viewer',
		}),
});
