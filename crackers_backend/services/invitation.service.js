const crypto = require('crypto');
const { TenantUser, Invitation } = require('../models');
const createError = require('../utils/error.util');
const {
	createInvitationSchema,
} = require('../validations/invitation.validation');
const { sendEmail } = require('../utils/mailer'); // 👈 add mailer

// Create Invitation Service
exports.createInvitation = async (dto) => {
	// 1. Validate DTO with Joi
	const { error, value } = createInvitationSchema.validate(dto);
	if (error) {
		throw createError(error.details[0].message, 400);
	}
	const { tenantId, organizationId, inviteEmail, inviteRole } = value;

	// 2. Ensure tenant exists
	const tenant = await TenantUser.findOne({
		where: {
			tenant_id: tenantId,
			organization_id: organizationId,
		},
	});
	if (!tenant) {
		throw createError("Tenant doesn't have any organization", 403);
	}

	// 3. Ensure requester is admin/owner
	if (tenant.role !== 'owner' && tenant.role !== 'admin') {
		throw createError('Unauthorized - only admins can send invitations', 403);
	}

	// 4. Prevent duplicate pending invite
	const existingInvite = await Invitation.findOne({
		where: {
			tenant_id: tenantId,
			organization_id: organizationId,
			invite_email: inviteEmail,
			invite_status: 'pending',
		},
	});
	if (existingInvite) {
		throw createError('Invitation already pending for this email', 409);
	}

	// 5. Generate secure token
	const inviteToken = crypto.randomBytes(32).toString('hex');

	// 6. Create new invitation
	const invitation = await Invitation.create({
		tenant_id: tenantId,
		organization_id: organizationId,
		invite_email: inviteEmail,
		invite_role: inviteRole,
		invite_token: inviteToken,
		invite_status: 'pending',
		invite_date: new Date(),
	});

	// 7. Send invitation email
	const inviteLink = `${process.env.APP_URL}/invitations/accept/accept?token=${inviteToken}organizationId=${organizationId}`;
	await sendEmail({
		to: inviteEmail,
		subject: 'You are invited to join Crackers App',
		html: `
			<h2>Welcome to Crackers App</h2>
			<p>You have been invited to join as <b>${inviteRole}</b>.</p>
			<p>Click below to accept your invitation:</p>
			<a href="${inviteLink}" target="_blank">Accept Invitation</a>
		`,
	});

	// 8. Return response
	return {
		success: true,
		message: 'Invitation sent successfully',
		data: {
			tenant_id: invitation.tenant_id,
			organization_id: invitation.organization_id,
			invite_email: invitation.invite_email,
			invite_role: invitation.invite_role,
			invite_token: invitation.invite_token,
		},
	};
};
