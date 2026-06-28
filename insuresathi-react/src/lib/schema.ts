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
    age: z.coerce.number().optional(),
    share: z.coerce.number().optional(),
});

export const familyMemberSchema = z.object({
    relation: z.string().optional(),
    status: z.string().optional(),
    age: z.coerce.number().optional(),
    health: z.string().optional(),
    deathReason: z.string().optional(),
    deathYear: z.string().optional(),
});

export const previousPolicySchema = z.object({
    policyName: z.string().optional(),
    policyNumber: z.string().optional(),
    sumAssured: z.coerce.number().optional(),
    premiumAmount: z.coerce.number().optional(),
    docDate: z.date().optional(),
    status: z.string().optional(),
});

export const referenceSchema = z.object({
    name: z.string().optional(),
    contact: z.string().optional(),
    address: z.string().optional(),
});

export const insuranceFormSchema = z.object({
    personal: z.object({
        docDate: z.date().optional(),
        backDatingDate: z.date().optional(),
        topPolicyNumber: z.string().optional(),
        name: z.string().optional(),
        address: z.string().optional(),
        fatherName: z.string().optional(),
        motherName: z.string().optional(),
        spouseName: z.string().optional(),
        gender: z.string().optional(),
        maritalStatus: z.string().optional(),
        qualification: z.string().optional(),
        dob: z.date().optional(),
        age: z.coerce.number().optional(),
        placeOfBirth: z.string().optional(),
        mobile: z.string().optional(),
        email: z.string().email("Invalid email address").optional().or(z.literal('')),
        knowCustomerDuration: z.string().optional(),
        photo: z.any().optional(),
    }),
    kyc: z.object({
        aadhaarNumber: z.string().optional(),
        panNumber: z.string().optional(),
        kycNumber: z.string().optional(),
        accessId: z.string().optional(),
        bocNumber: z.string().optional(),
        bocDate: z.date().optional(),
        bocAmount: z.coerce.number().optional(),
    }),
    occupation: z.object({
        occupationType: z.string().optional(),
        designation: z.string().optional(),
        department: z.string().optional(),
        serviceYears: z.coerce.number().optional(),
        serviceMonths: z.coerce.number().optional(),
        businessName: z.string().optional(),
        typeOfBusiness: z.string().optional(),
        businessYear: z.coerce.number().optional(),
        businessMonths: z.coerce.number().optional(),
        annualIncome: z.coerce.number().optional(),
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
        sumAssured: z.coerce.number().optional(),
        premiumMode: z.string().optional(),
        premiumAmount: z.coerce.number().optional(),
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
        weight: z.coerce.number().optional(),
        birthMark: z.string().optional(),
        treatmentDetailsGeneral: z.string().optional(),
        isPregnant: z.string().optional(),
        deliveryMode: z.string().optional(),
        lastDeliveryDate: z.date().optional(),
        treatmentDetails: z.string().optional(),
        husbandName_mw: z.string().optional(),
        husbandOccupation_mw: z.string().optional(),
        husbandIncome_mw: z.coerce.number().optional(),
    }),
    remarks: z.string().optional(),
});

export type InsuranceFormValues = z.infer<typeof insuranceFormSchema>;
