import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { deliveryPartnerValidationSchema } from 'validationSchema/delivery-partners';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.delivery_partner
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getDeliveryPartnerById();
    case 'PUT':
      return updateDeliveryPartnerById();
    case 'DELETE':
      return deleteDeliveryPartnerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDeliveryPartnerById() {
    const data = await prisma.delivery_partner.findFirst(convertQueryToPrismaUtil(req.query, 'delivery_partner'));
    return res.status(200).json(data);
  }

  async function updateDeliveryPartnerById() {
    await deliveryPartnerValidationSchema.validate(req.body);
    const data = await prisma.delivery_partner.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteDeliveryPartnerById() {
    const data = await prisma.delivery_partner.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
