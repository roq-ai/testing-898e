import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { deliveryPartnerValidationSchema } from 'validationSchema/delivery-partners';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getDeliveryPartners();
    case 'POST':
      return createDeliveryPartner();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDeliveryPartners() {
    const data = await prisma.delivery_partner
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'delivery_partner'));
    return res.status(200).json(data);
  }

  async function createDeliveryPartner() {
    await deliveryPartnerValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.delivery_request?.length > 0) {
      const create_delivery_request = body.delivery_request;
      body.delivery_request = {
        create: create_delivery_request,
      };
    } else {
      delete body.delivery_request;
    }
    const data = await prisma.delivery_partner.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
