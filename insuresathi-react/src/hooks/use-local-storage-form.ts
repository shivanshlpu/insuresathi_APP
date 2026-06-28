import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insuranceFormSchema, InsuranceFormValues } from '@/lib/schema';

const FORM_DATA_KEY = 'insuresathi_form_data';

export const defaultValues: InsuranceFormValues = {
  personal: {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    mobile: '9876543210',
    maritalStatus: 'married',
    address: '123, Vasant Kunj, Sector B, New Delhi, 110070',
    spouseName: 'Priya Sharma',
    fatherName: 'Ramesh Sharma',
    motherName: 'Sunita Sharma',
    gender: 'Male',
    qualification: 'B.Tech',
    age: 35,
    placeOfBirth: 'New Delhi',
    knowCustomerDuration: '5 Years',
    photo: undefined,
    dob: new Date('1989-05-14T00:00:00Z'),
    docDate: new Date('2024-03-12T00:00:00Z'),
    backDatingDate: new Date('2024-03-01T00:00:00Z'),
    topPolicyNumber: 'POL-9988776655',
  },
  kyc: {
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '123456789012',
    kycNumber: 'KYC987654321',
    accessId: 'ACC-102938',
    bocNumber: 'BOC-556677',
    bocAmount: 15000,
    bocDate: new Date('2024-03-10T00:00:00Z'),
  },
  occupation: {
      occupationType: "Service",
      designation: 'Software Engineer',
      department: 'IT',
      serviceYears: 8,
      serviceMonths: 6,
      businessName: 'Tech Solutions Ltd',
      typeOfBusiness: 'IT Services',
      businessYear: 10,
      businessMonths: 2,
      annualIncome: 1200000,
  },
  bank: {
    bankName: 'HDFC Bank',
    accountNumber: '50100234567890',
    accountType: 'Saving',
    ifscCode: 'HDFC0001234',
    bankAddress: 'Connaught Place, New Delhi',
  },
  policy: {
    planNumber: 'Jeevan Anand - 915',
    term: '21',
    sumAssured: 1000000,
    premiumMode: 'Yearly',
    premiumAmount: 52000,
    adbRider: 'Yes',
    abRider: 'No',
    termRider: 'Yes',
    cirRider: 'No',
    nominees: [
      { name: 'Priya Sharma', relation: 'Wife', age: 32, percentage: 100 }
    ],
    familyMembers: [
      { name: 'Ramesh Sharma', relation: 'Father', age: 65, health: 'Good' },
      { name: 'Sunita Sharma', relation: 'Mother', age: 60, health: 'Good' }
    ],
    previousPolicies: [
      { policyNo: 'LIC-112233', doc: new Date('2015-06-01T00:00:00Z'), sumAssured: 500000 }
    ],
    references: [
      { name: 'Amit Kumar', mobile: '9988776655' }
    ],
  },
  medical: {
    height: '175 cm',
    weight: 75,
    birthMark: 'Mole on right cheek',
    treatmentDetailsGeneral: 'None',
    isPregnant: 'No',
    deliveryMode: 'Normal',
    lastDeliveryDate: undefined,
    treatmentDetails: 'None',
    husbandName_mw: 'Rahul Sharma',
    husbandOccupation_mw: 'Software Engineer',
    husbandIncome_mw: 1200000,
  },
  remarks: 'Customer is healthy and all documents have been verified.',
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
