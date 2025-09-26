const invitationService = require('../services/invitation.service');
const { createInvitationDto } = require('../dtos/invitation.dto');

exports.invite = async (req, res) => {
	try {
		const dto = createInvitationDto(req);
		const data = await invitationService.createInvitation(dto);

		res.status(201).json(data);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
