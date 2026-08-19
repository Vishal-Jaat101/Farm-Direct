// Mock disputes data

export const DISPUTE_TYPES = {
  QUALITY: 'quality',
  QUANTITY: 'quantity',
  DAMAGE: 'damage',
  LATE_DELIVERY: 'late_delivery',
  WRONG_ITEM: 'wrong_item',
  OTHER: 'other',
};

export const DISPUTE_STATUS = {
  OPEN: 'open',
  UNDER_REVIEW: 'under_review',
  RESOLVED: 'resolved',
  ESCALATED: 'escalated',
};

export const RESOLUTION_TYPES = {
  FULL_RELEASE: 'full_release',
  PARTIAL_RELEASE: 'partial_release',
  FULL_REFUND: 'full_refund',
  RE_DELIVERY: 're_delivery',
};

export const disputes = [
  {
    id: 'dispute-001',
    orderId: 'order-008',
    buyerId: 'buyer-001',
    farmerId: 'farmer-003',
    type: DISPUTE_TYPES.QUALITY,
    status: DISPUTE_STATUS.OPEN,
    title: 'Quality below grade — sprouted potatoes',
    description: 'Received 1000kg of Kufri Jyoti potatoes. Approximately 30% of the batch shows sprouting and green patches. Listed grade was A but delivered quality is C at best.',
    evidencePhotos: ['/images/disputes/potato-sprout-1.jpg', '/images/disputes/potato-sprout-2.jpg'],
    buyerMessage: 'Many potatoes are sprouted and green. This is not Grade A quality. Our quality team rejected this batch for retail.',
    farmerResponse: 'The potatoes were fresh at dispatch. The delay in transit may have caused the sprouting. They were stored properly at my end.',
    createdAt: '2026-08-12T11:00:00Z',
    slaDeadline: '2026-08-14T11:00:00Z',
    resolution: null,
    resolvedAt: null,
    assignedAdmin: 'admin-002',
    amount: 22000,
  },
  {
    id: 'dispute-002',
    orderId: 'order-017',
    buyerId: 'buyer-002',
    farmerId: 'farmer-002',
    type: DISPUTE_TYPES.QUANTITY,
    status: DISPUTE_STATUS.RESOLVED,
    title: 'Short delivery — Rice quantity mismatch',
    description: 'Ordered 3 quintals of Sona Masoori rice. Received only 2.6 quintals upon weighing. Short by 40kg.',
    evidencePhotos: ['/images/disputes/rice-weight-1.jpg'],
    buyerMessage: 'Weighed at our dock — 260kg received vs 300kg ordered. Weighment slip attached.',
    farmerResponse: 'I loaded 3 quintals. Bags may have lost some moisture in transit. I accept the difference.',
    createdAt: '2026-07-23T12:00:00Z',
    slaDeadline: '2026-07-25T12:00:00Z',
    resolution: {
      type: RESOLUTION_TYPES.PARTIAL_RELEASE,
      farmerPayout: 8320,
      buyerRefund: 1280,
      note: 'Partial refund for 40kg shortfall. ₹1,280 refunded to buyer (40kg × ₹32/kg). Remaining ₹8,320 released to farmer.',
    },
    resolvedAt: '2026-07-25T09:00:00Z',
    assignedAdmin: 'admin-002',
    amount: 9600,
  },
  {
    id: 'dispute-003',
    orderId: 'order-013',
    buyerId: 'buyer-001',
    farmerId: 'farmer-011',
    type: DISPUTE_TYPES.DAMAGE,
    status: DISPUTE_STATUS.UNDER_REVIEW,
    title: 'Transport damage — bruised bananas',
    description: 'Large portion of the 1500kg Cavendish banana shipment arrived with bruising and blackened spots. Packaging was insufficient for the distance.',
    evidencePhotos: ['/images/disputes/banana-damage-1.jpg', '/images/disputes/banana-damage-2.jpg'],
    buyerMessage: 'About 40% of the bananas are too bruised for retail. The crates were not packed tightly enough and shifted during transit.',
    farmerResponse: 'I packed them as I always do. The transporter should be held responsible — the truck had no cushioning.',
    createdAt: '2026-08-10T12:00:00Z',
    slaDeadline: '2026-08-12T12:00:00Z',
    resolution: null,
    resolvedAt: null,
    assignedAdmin: 'admin-001',
    amount: 42000,
  },
  {
    id: 'dispute-004',
    orderId: 'order-018',
    buyerId: 'buyer-001',
    farmerId: 'farmer-003',
    type: DISPUTE_TYPES.QUALITY,
    status: DISPUTE_STATUS.RESOLVED,
    title: 'Wheat moisture content too high',
    description: 'Sharbati wheat moisture content measured at 14.5% vs stated 12%. Higher moisture affects shelf life.',
    evidencePhotos: ['/images/disputes/wheat-moisture-1.jpg'],
    buyerMessage: 'Lab test shows 14.5% moisture. This reduces shelf life significantly. We need compensation.',
    farmerResponse: 'Moisture was 12% when I dispatched. Request independent test.',
    createdAt: '2026-05-05T10:00:00Z',
    slaDeadline: '2026-05-07T10:00:00Z',
    resolution: {
      type: RESOLUTION_TYPES.PARTIAL_RELEASE,
      farmerPayout: 63000,
      buyerRefund: 7000,
      note: '10% compensation to buyer for moisture variance. ₹7,000 refunded. Balance ₹63,000 released to farmer.',
    },
    resolvedAt: '2026-05-07T08:00:00Z',
    assignedAdmin: 'admin-001',
    amount: 70000,
  },
  {
    id: 'dispute-005',
    orderId: 'order-009',
    buyerId: 'buyer-004',
    farmerId: 'farmer-004',
    type: DISPUTE_TYPES.LATE_DELIVERY,
    status: DISPUTE_STATUS.RESOLVED,
    title: 'Mango delivery delayed by 2 days',
    description: 'Alphonso mangoes arrived 2 days late. Some were overripe upon arrival.',
    evidencePhotos: ['/images/disputes/mango-overripe-1.jpg'],
    buyerMessage: 'Received 2 days after promised date. 3 of 10 dozen are overripe and unusable.',
    farmerResponse: 'Delay was due to truck breakdown. I am willing to compensate for the overripe ones.',
    createdAt: '2026-05-19T10:00:00Z',
    slaDeadline: '2026-05-21T10:00:00Z',
    resolution: {
      type: RESOLUTION_TYPES.PARTIAL_RELEASE,
      farmerPayout: 8400,
      buyerRefund: 3600,
      note: 'Refund for 3 dozen overripe mangoes (3 × ₹1,200 = ₹3,600). Remaining ₹8,400 released to farmer.',
    },
    resolvedAt: '2026-05-20T14:00:00Z',
    assignedAdmin: 'admin-002',
    amount: 12000,
  },
];

// Helper functions
export function getDisputeById(id) {
  return disputes.find(d => d.id === id) || null;
}

export function getOpenDisputes() {
  return disputes.filter(d => d.status === DISPUTE_STATUS.OPEN || d.status === DISPUTE_STATUS.UNDER_REVIEW);
}

export function getDisputesByFarmer(farmerId) {
  return disputes.filter(d => d.farmerId === farmerId);
}

export function getDisputesByBuyer(buyerId) {
  return disputes.filter(d => d.buyerId === buyerId);
}
