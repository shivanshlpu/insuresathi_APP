import { z } from "zod";

const fileSchema = z.any()
  .refine(file => file?.size <= 10 * 1024 * 1024, `Max file size is 10MB.`)
  .refine(
    file => !file || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file?.type),
    ".jpg, .jpeg, .png and .webp files are accepted."
  ).optional();

export const nomineeSchema = z.object({
    name: z.string().optional(),
    relation: z.string().optional(),
    age: z.any().optional(),
    share: z.any().optional(),
    appointeeName: z.string().optional(),
    appointeeRelation: z.string().optional(),
    appointeeAge: z.any().optional(),
});

export const familyMemberSchema = z.object({
    relation: z.string().optional(),
    status: z.string().optional(),
    count: z.any().optional(),
    age: z.any().optional(),
    health: z.string().optional(),
    deathReason: z.string().optional(),
    deathYear: z.string().optional(),
});

export const previousPolicySchema = z.object({
    policyName: z.string().optional(),
    policyNumber: z.string().optional(),
    sumAssured: z.any().optional(),
    term: z.string().optional(),
    premiumPayingTerm: z.string().optional(),
    status: z.string().optional(),
});

export const referenceSchema = z.object({
    name: z.string().optional(),
    contact: z.string().optional(),
    address: z.string().optional(),
});

export const insuranceFormSchema = z.object({
    personal: z.object({
        docDate: z.any().optional(),
        backDatingDate: z.any().optional(),
        topPolicyNumber: z.string().optional(),
        name: z.string().optional(),
        address: z.string().optional(),
        fatherName: z.string().optional(),
        motherName: z.string().optional(),
        spouseName: z.string().optional(),
        gender: z.string().optional(),
        maritalStatus: z.string().optional(),
        qualification: z.string().optional(),
        qualificationClass: z.string().optional(),
        dob: z.any().optional(),
        age: z.any().optional(),
        placeOfBirth: z.string().optional(),
        mobile: z.string().optional(),
        email: z.string().optional(),
        knowCustomerDuration: z.string().optional(),
        photo: z.any().optional(),
    }),
    kyc: z.object({
        aadhaarNumber: z.string().optional(),
        panNumber: z.string().optional(),
        kycNumber: z.string().optional(),
        accessId: z.string().optional(),
        bocNumber: z.string().optional(),
        bocDate: z.any().optional(),
        bocAmount: z.any().optional(),
    }),
    occupation: z.object({
        occupationType: z.string().optional(),
        designation: z.string().optional(),
        department: z.string().optional(),
        serviceYears: z.any().optional(),
        serviceMonths: z.any().optional(),
        businessName: z.string().optional(),
        typeOfBusiness: z.string().optional(),
        gstNumber: z.string().optional(),
        businessYear: z.any().optional(),
        businessMonths: z.any().optional(),
        annualIncome: z.any().optional(),
    }),
    bank: z.object({
        bankName: z.string().optional(),
        accountNumber: z.string().optional(),
        accountType: z.string().optional(),
        ifscCode: z.string().optional(),
        bankAddress: z.string().optional(),
    }),
    policy: z.object({
        planNumber: z.string().optional(),
        term: z.string().optional(),
        sumAssured: z.any().optional(),
        premiumMode: z.string().optional(),
        premiumAmount: z.any().optional(),
        adbRider: z.string().optional(),
        abRider: z.string().optional(),
        termRider: z.string().optional(),
        cirRider: z.string().optional(),
        nominees: z.array(nomineeSchema).optional(),
        familyMembers: z.array(familyMemberSchema).optional(),
        previousPolicies: z.array(previousPolicySchema).optional(),
        references: z.array(referenceSchema).optional(),
    }),
    medical: z.object({
        height: z.string().optional(),
        weight: z.any().optional(),
        birthMark: z.string().optional(),
        treatmentDetailsGeneral: z.string().optional(),
        isPregnant: z.string().optional(),
        deliveryMode: z.string().optional(),
        lastDeliveryDate: z.any().optional(),
        treatmentDetails: z.string().optional(),
        husbandName_mw: z.string().optional(),
        husbandOccupation_mw: z.string().optional(),
        husbandIncome_mw: z.any().optional(),
    }),
    remarks: z.string().optional(),
});

export type InsuranceFormValues = z.infer<typeof insuranceFormSchema>;
