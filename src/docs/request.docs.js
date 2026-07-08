/**
 * @swagger
 * /request/send/{status}/{toUserid}:
 *   post:
 *     summary: Send or ignore a connection request
 *     tags: [Connection Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [interested, ignored]
 *         description: Status of the request
 *       - in: path
 *         name: toUserid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to send request to
 *     responses:
 *       200:
 *         description: Connection request sent successfully
 *       400:
 *         description: Invalid status, sending to self, or request already exists
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: User not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /request/review/{status}/{requestId}:
 *   post:
 *     summary: Accept or reject a connection request
 *     tags: [Connection Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [accepted, rejected]
 *         description: Status to update the request to
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the connection request
 *     responses:
 *       200:
 *         description: Connection request reviewed successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Connection request not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
