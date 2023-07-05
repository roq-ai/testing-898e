import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { customerComplaintValidationSchema } from 'validationSchema/customer-complaints';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.customer_complaint
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCustomerComplaintById();
    case 'PUT':
      return updateCustomerComplaintById();
    case 'DELETE':
      return deleteCustomerComplaintById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCustomerComplaintById() {
    const data = await prisma.customer_complaint.findFirst(convertQueryToPrismaUtil(req.query, 'customer_complaint'));
    return res.status(200).json(data);
  }

  async function updateCustomerComplaintById() {
    await customerComplaintValidationSchema.validate(req.body);
    const data = await prisma.customer_complaint.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCustomerComplaintById() {
    const data = await prisma.customer_complaint.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
