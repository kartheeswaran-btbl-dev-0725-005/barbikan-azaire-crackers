exports.createInvitationDto = (req) => {
	return {
		tenantId: req.params?.tenantId || null,
		organizationId: req.params?.organizationId || null,
		inviteEmail: req.body?.email?.trim().toLowerCase() || null,
		inviteRole: req.body?.role || 'viewer',
	};
};
