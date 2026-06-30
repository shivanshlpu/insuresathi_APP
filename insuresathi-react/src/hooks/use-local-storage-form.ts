import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insuranceFormSchema, InsuranceFormValues } from '@/lib/schema';

const FORM_DATA_KEY = 'insuresathi_form_data';

export const defaultValues: InsuranceFormValues = {
  personal: {
    name: '',
    email: '',
    mobile: '',
    maritalStatus: '',
    address: '',
    spouseName: '',
    fatherName: '',
    motherName: '',
    gender: '',
    qualification: '',
    age: undefined,
    placeOfBirth: '',
    knowCustomerDuration: '',
    photo: undefined,
    dob: undefined,
    docDate: undefined,
    backDatingDate: undefined,
    topPolicyNumber: '',
  },
  kyc: {
    panNumber: '',
    aadhaarNumber: '',
    kycNumber: '',
    accessId: '',
    bocNumber: '',
    bocAmount: undefined,
    bocDate: undefined,
  },
  occupation: {
      occupationType: "",
      designation: '',
      department: '',
      serviceYears: undefined,
      serviceMonths: undefined,
      businessName: '',
      typeOfBusiness: '',
      gstNumber: '',
      businessYear: undefined,
      businessMonths: undefined,
      annualIncome: undefined,
  },
  bank: {
    bankName: '',
    accountNumber: '',
    accountType: '',
    ifscCode: '',
    bankAddress: '',
  },
  policy: {
    planNumber: '',
    term: '',
    sumAssured: undefined,
    premiumMode: '',
    premiumAmount: undefined,
    adbRider: '',
    abRider: '',
    termRider: '',
    cirRider: '',
    nominees: [],
    familyMembers: [],
    previousPolicies: [],
    references: [],
  },
  medical: {
    height: '',
    weight: undefined,
    birthMark: '',
    treatmentDetailsGeneral: '',
    isPregnant: '',
    deliveryMode: '',
    lastDeliveryDate: undefined,
    treatmentDetails: '',
    husbandName_mw: '',
    husbandOccupation_mw: '',
    husbandIncome_mw: undefined,
  },
  remarks: '',
};

export const useLocalStorageForm = (): [UseFormReturn<InsuranceFormValues>, boolean] => {
  const [isInitialized, setIsInitialized] = useState(false);

  const form = useForm<InsuranceFormValues>({
    resolver: zodResolver(insuranceFormSchema),
    defaultValues: defaultValues,
    mode: 'onTouched'
  });

  useEffect(() => {
    let savedData: Partial<InsuranceFormValues> = {};
    try {
      const savedJson = localStorage.getItem(FORM_DATA_KEY);
      if (savedJson) {
        const parsed = JSON.parse(savedJson, (key, value) => {
            if (['dob', 'docDate', 'backDatingDate', 'bocDate', 'lastDeliveryDate', 'docDate'].includes(key) && value) {
                return new Date(value);
            }
            return value;
        });

        if (typeof parsed === 'object' && parsed !== null) {
            savedData = parsed;
        }
      }
    } catch (error) {
      console.error("Failed to parse form data from localStorage", error);
    }
    
    // Force defaultValues for testing purposes
    const initialValues = {
        ...defaultValues
    };

    // Ensure potentially undefined number fields are reset to 0
    initialValues.kyc.bocAmount = initialValues.kyc.bocAmount || 0;
    initialValues.occupation.serviceYears = initialValues.occupation.serviceYears || 0;
    initialValues.occupation.serviceMonths = initialValues.occupation.serviceMonths || 0;
    initialValues.occupation.businessYear = initialValues.occupation.businessYear || 0;
    initialValues.occupation.businessMonths = initialValues.occupation.businessMonths || 0;
    initialValues.medical.weight = initialValues.medical.weight || 0;
    initialValues.medical.husbandIncome_mw = initialValues.medical.husbandIncome_mw || 0;

    form.reset(initialValues);
    setIsInitialized(true);
  }, [form]);

  useEffect(() => {
    if (isInitialized) {
      const subscription = form.watch((value) => {
        try {
          const jsonValue = JSON.stringify(value);
          localStorage.setItem(FORM_DATA_KEY, jsonValue);
        } catch (error) {
          console.error("Failed to save form data to localStorage", error);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [form, isInitialized]);

  return [form, isInitialized];
};
