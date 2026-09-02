export type { PricingRule, PromotionStatus, ValidationResult, Promotion, CustomerSegment } from "./types";

export {
  listPricingRules,
  getPricingRule,
  addPricingRule,
  removePricingRule,
} from "./api/pricingRules";
export {
  listPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  selectProductsForPromotion,
  submitPromotionForValidation,
  runValidation,
  approvePromotion,
  rejectPromotion,
  activatePromotion,
  deactivatePromotion,
  archivePromotion,
} from "./api/promotions";
export { listCustomerSegments } from "./api/customerSegments";

export { pricingRulesSlice, setPricingRules, upsertPricingRule } from "./store/pricingRulesSlice";
export { promotionsSlice, setPromotions, upsertPromotion } from "./store/promotionsSlice";
export { customerSegmentsSlice, setCustomerSegments } from "./store/customerSegmentsSlice";
export { categoryRefsSlice, setCategoryRefs } from "./store/categoryRefsSlice";

export { PricingRuleForm } from "./components/PricingRuleForm";
export { PromotionStatusTimeline } from "./components/PromotionStatusTimeline";
export { ValidationResultsPanel } from "./components/ValidationResultsPanel";
export { ApprovalActionBar } from "./components/ApprovalActionBar";

export { PricingRulesPage } from "./pages/PricingRulesPage";
export { PromotionsPage } from "./pages/PromotionsPage";
export { PromotionWizardPage } from "./pages/PromotionWizardPage";
export { PromotionDetailsPage } from "./pages/PromotionDetailsPage";
export { ValidationQueuePage } from "./pages/ValidationQueuePage";
export { ApprovalsPage } from "./pages/ApprovalsPage";
export { CustomerSegmentsPage } from "./pages/CustomerSegmentsPage";
