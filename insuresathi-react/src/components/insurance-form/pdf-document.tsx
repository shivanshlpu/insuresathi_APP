import React from 'react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { InsuranceFormValues } from '@/lib/schema';
import placeholderImages from '@/lib/placeholder-images.json';

interface PdfDocumentProps {
    data: InsuranceFormValues;
    t: (key: string) => string;
}

const PdfPage: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={cn("bg-white text-[12.5px] text-gray-900 font-[_PT_Sans,'sans-serif'] pdf-page w-[210mm]", className)} style={{ fontFamily: "'PT Sans', sans-serif" }}>
        <div className="p-3">
            {children}
        </div>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
    <div className={cn("mb-2 break-inside-auto", className)}>
        <h2 className="text-[13.5px] font-bold bg-gray-100 border border-gray-300 px-2 py-0.5 mb-1 text-gray-800 uppercase tracking-wider break-after-avoid">{title}</h2>
        {children}
    </div>
);

const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="border-t border-l border-gray-300 break-inside-auto block">
        {children}
        <div className="clear-both"></div>
    </div>
);

interface CellProps {
    label: string;
    value: React.ReactNode;
    span?: 3 | 4 | 6 | 8 | 9 | 12;
    className?: string;
}

const Cell: React.FC<CellProps> = ({ label, value, span = 12, className }) => {
    const spanClasses = {
        3: 'w-1/4',
        4: 'w-1/3',
        6: 'w-1/2',
        8: 'w-2/3',
        9: 'w-3/4',
        12: 'w-full'
    };

    return (
        <div className={cn(
            "border-r border-b border-gray-300 p-1 break-inside-avoid min-h-[18px] float-left",
            spanClasses[span],
            className
        )}>
            <span className="font-bold text-gray-600 mr-1">{label}:</span>
            <span className="text-gray-900 break-words font-medium whitespace-pre-wrap">{value || 'N/A'}</span>
        </div>
    );
};

const Table: React.FC<{ headers: string[]; children: React.ReactNode }> = ({ headers, children }) => (
    <table className="w-full border-collapse text-[12px] mt-1 break-inside-auto">
        <thead>
            <tr className="bg-gray-100 break-inside-avoid">
                {headers.map((h, i) => (
                    <th key={i} className="border border-gray-300 p-1 text-left font-bold text-gray-700 uppercase tracking-wider">{h}</th>
                ))}
            </tr>
        </thead>
        <tbody>{children}</tbody>
    </table>
);

const PdfDocument: React.FC<PdfDocumentProps> = ({ data, t }) => {
    const defaultAvatar = placeholderImages.placeholderImages.find(p => p.id === 'user-avatar')?.imageUrl;
    const photoSrc = data.personal.photo || defaultAvatar;

    const PdfHeader = () => (
        <header className="flex items-start justify-between mb-2 pb-1.5 border-b border-gray-300">
            <div>
                 <h1 className="text-lg font-bold text-gray-800 uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif"}}>UMESH PRASAD TIWARI</h1>
                <div className="text-[12.5px] text-gray-600 font-semibold leading-tight mt-0.5">
                    <p>LIFE INSURANCE CORPORATION OF INDIA</p>
                    <p>CLIA/ZM CLUB MEMBER | AGENCY CODE: 05916370</p>
                </div>
                <div className="flex space-x-4 text-[11px] mt-1 text-gray-700">
                    <p><span className="font-bold">{t('general.doc_date')}:</span> {data.personal.docDate ? format(new Date(data.personal.docDate), 'PPP') : 'N/A'}</p>
                    <p><span className="font-bold">{t('general.back_dating_date')}:</span> {data.personal.backDatingDate ? format(new Date(data.personal.backDatingDate), 'PPP') : 'N/A'}</p>
                    <p><span className="font-bold">{t('general.top_policy_number')}:</span> {data.personal.topPolicyNumber || 'N/A'}</p>
                </div>
            </div>
            {photoSrc && (
                <div className="border border-gray-300 p-0.5 bg-white shrink-0">
                    <img src={photoSrc} alt="Applicant Photo" width={50} height={50} className="object-cover" crossOrigin="anonymous" />
                </div>
            )}
        </header>
    );
    
    const serviceLength = [data.occupation.serviceYears, data.occupation.serviceMonths]
        .filter((v): v is number => typeof v === 'number' && v > 0)
        .map((v, i) => `${v} ${i === 0 ? t('occupation.years') : t('occupation.months')}`)
        .join(', ') || 'N/A';

    const businessLength = [data.occupation.businessYear, data.occupation.businessMonths]
        .filter((v): v is number => typeof v === 'number' && v > 0)
        .map((v, i) => `${v} ${i === 0 ? t('occupation.years') : t('occupation.months')}`)
        .join(', ') || 'N/A';

    return (
        <div>
            <PdfPage>
                <PdfHeader />
                
                <Section title={t('pdf.section.personal')}>
                    <Grid>
                        <Cell label={t('personal.name')} value={data.personal.name} span={6} />
                        <Cell label={t('personal.dob')} value={data.personal.dob ? format(new Date(data.personal.dob), 'PPP') : 'N/A'} span={3} />
                        <Cell label={t('personal.age')} value={data.personal.age} span={3} />
                        
                        <Cell label={t('personal.address')} value={data.personal.address} span={12} />
                        
                        <Cell label={t('personal.father_name')} value={data.personal.fatherName} span={6} />
                        <Cell label={t('personal.mother_name')} value={data.personal.motherName} span={6} />
                        
                        <Cell label={t('personal.marital_status')} value={data.personal.maritalStatus} span={3} />
                        <Cell label={t('personal.spouse_name')} value={data.personal.maritalStatus?.toLowerCase() === 'married' || data.personal.spouseName ? data.personal.spouseName : 'N/A'} span={3} />
                        <Cell label={t('personal.gender')} value={data.personal.gender} span={3} />
                        <Cell label={t('personal.qualification')} value={data.personal.qualification ? `${data.personal.qualification}${data.personal.qualificationClass ? ` (${data.personal.qualificationClass})` : ''}` : 'N/A'} span={3} />
                        
                        <Cell label={t('personal.place_of_birth')} value={data.personal.placeOfBirth} span={4} />
                        <Cell label={t('personal.mobile')} value={data.personal.mobile} span={4} />
                        <Cell label={t('personal.know_customer_duration')} value={data.personal.knowCustomerDuration} span={4} />

                        <Cell label={t('personal.email')} value={data.personal.email} span={12} />
                        
                        {/* KYC Subheader */}
                        <div className="w-full bg-gray-50 border-r border-b border-gray-300 px-2 py-0.5 font-bold text-gray-700 tracking-wider text-[12px] uppercase break-after-avoid float-left">
                            {t('personal.kyc_subheader')}
                        </div>
                        
                        <Cell label={t('personal.aadhaar_number')} value={data.kyc.aadhaarNumber} span={4} />
                        <Cell label={t('personal.pan_number')} value={data.kyc.panNumber} span={4} />
                        <Cell label={t('personal.kyc_number')} value={data.kyc.kycNumber} span={4} />
                        
                        <Cell label={t('personal.access_id')} value={data.kyc.accessId} span={4} />
                        <Cell label={t('personal.boc_number')} value={data.kyc.bocNumber} span={4} />
                        <Cell label={t('personal.boc_date')} value={data.kyc.bocDate ? format(new Date(data.kyc.bocDate), 'PPP') : 'N/A'} span={4} />
                        
                        <Cell label={t('personal.boc_amount')} value={data.kyc.bocAmount ? `Rs. ${data.kyc.bocAmount.toLocaleString('en-IN')}` : 'N/A'} span={12} />
                    </Grid>
                </Section>
                
                 <Section title={t('pdf.section.occupation') + " & " + t('pdf.section.bank')}>
                    <Grid>
                        <Cell label={t('occupation.occupation_type')} value={data.occupation.occupationType} span={4} />
                        <Cell label={t('occupation.yearly_income')} value={data.occupation.annualIncome ? `Rs. ${data.occupation.annualIncome.toLocaleString('en-IN')}` : 'N/A'} span={8} />
                        
                        {data.occupation.occupationType?.toLowerCase() === 'service' && (
                            <>
                                <Cell label={t('occupation.designation')} value={data.occupation.designation} span={4} />
                                <Cell label={t('occupation.department')} value={data.occupation.department} span={4} />
                                <Cell label={t('occupation.service_year')} value={serviceLength} span={4} />
                            </>
                        )}
                        {data.occupation.occupationType?.toLowerCase() === 'business' && (
                            <>
                                <Cell label={t('occupation.business_name')} value={data.occupation.businessName} span={3} />
                                <Cell label={t('occupation.type_of_business')} value={data.occupation.typeOfBusiness} span={3} />
                                <Cell label={t('occupation.gst_number') || 'GST Number'} value={data.occupation.gstNumber} span={3} />
                                <Cell label={t('occupation.business_year')} value={businessLength} span={3} />
                            </>
                        )}
                        {(data.occupation.occupationType?.toLowerCase() === 'other' || (!['service', 'business'].includes(data.occupation.occupationType?.toLowerCase() || '') && (data.occupation.designation || data.occupation.serviceYears || data.occupation.businessName))) && (
                            <>
                                <Cell label="Nature of Work / Occupation Details" value={data.occupation.designation || data.occupation.businessName || 'N/A'} span={6} />
                                <Cell label="Work Experience / Service" value={serviceLength !== 'N/A' ? serviceLength : businessLength} span={6} />
                            </>
                        )}
                        
                        <Cell label={t('occupation.bank_name')} value={data.bank.bankName} span={3} />
                        <Cell label={t('occupation.account_number')} value={data.bank.accountNumber} span={3} />
                        <Cell label={t('occupation.account_type')} value={data.bank.accountType} span={3} />
                        <Cell label={t('occupation.ifsc_code')} value={data.bank.ifscCode} span={3} />
                        
                        <Cell label={t('occupation.bank_address')} value={data.bank.bankAddress} span={12} />
                    </Grid>
                </Section>

                <Section title={t('pdf.section.plan')}>
                    <Grid>
                        <Cell label={t('policy.plan_number')} value={data.policy.planNumber} span={4} />
                        <Cell label={t('policy.term')} value={data.policy.term} span={4} />
                        <Cell label={t('policy.sum_assured')} value={data.policy.sumAssured ? `Rs. ${data.policy.sumAssured.toLocaleString('en-IN')}` : 'N/A'} span={4} />
                        
                        <Cell label={t('policy.premium_amount')} value={data.policy.premiumAmount ? `Rs. ${data.policy.premiumAmount.toLocaleString('en-IN')}` : 'N/A'} span={6} />
                        <Cell label={t('policy.premium_mode')} value={data.policy.premiumMode} span={6} />
                        
                        <Cell label={t('policy.adb_rider')} value={data.policy.adbRider} span={6} />
                        <Cell label={t('policy.ab_rider')} value={data.policy.abRider} span={6} />
                        <Cell label={t('policy.term_rider')} value={data.policy.termRider} span={6} />
                        <Cell label={t('policy.cir_rider')} value={data.policy.cirRider} span={6} />
                    </Grid>
                </Section>

                {data.policy.nominees && data.policy.nominees.length > 0 && (
                    <Section title={t('pdf.section.nominees')}>
                        <Table headers={[t('policy.nominee_name'), t('policy.nominee_relation'), t('policy.nominee_age'), t('policy.nominee_share'), 'Appointee']}>
                            {data.policy.nominees.map((n, i) => (
                                <tr key={i} className="break-inside-avoid border-b border-gray-200">
                                    <td className="border-r border-gray-300 p-1">{n.name}</td>
                                    <td className="border-r border-gray-300 p-1">{n.relation}</td>
                                    <td className="border-r border-gray-300 p-1">{n.age}</td>
                                    <td className="border-r border-gray-300 p-1">{n.share}%</td>
                                    <td className="p-1">
                                        {n.age !== undefined && n.age < 18 ? `${n.appointeeName || 'N/A'} (${n.appointeeRelation || 'N/A'}, Age: ${n.appointeeAge || 'N/A'})` : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </Section>
                )}
                
                 {data.policy.familyMembers && data.policy.familyMembers.length > 0 && (
                    <Section title={t('pdf.section.family')}>
                        <Table headers={[t('family.relation'), t('family.status'), t('family.age'), t('family.health'), t('family.death_reason'), t('family.death_year')]}>
                            {data.policy.familyMembers
                                .filter(n => n.relation && (n.age || (n.count && n.count > 0) || n.deathReason))
                                .map((n, i) => (
                                <tr key={i} className="break-inside-avoid border-b border-gray-200">
                                    <td className="border-r border-gray-300 p-1 font-bold text-gray-700">
                                        {n.relation}{n.count && n.count > 1 ? ` (${n.count})` : ''}
                                    </td>
                                    <td className="border-r border-gray-300 p-1">{n.status || 'Living'}</td>
                                    <td className="border-r border-gray-300 p-1">{n.age || 'N/A'}</td>
                                    <td className="border-r border-gray-300 p-1">{n.status === 'Deceased' ? 'N/A' : (n.health || 'Good')}</td>
                                    <td className="border-r border-gray-300 p-1">{n.status === 'Deceased' ? (n.deathReason || 'N/A') : 'N/A'}</td>
                                    <td className="p-1">{n.status === 'Deceased' ? (n.deathYear || 'N/A') : 'N/A'}</td>
                                </tr>
                            ))}
                        </Table>
                    </Section>
                 )}

                {data.policy.previousPolicies && data.policy.previousPolicies.length > 0 && (
                    <Section title={t('pdf.section.policies')}>
                        <Table headers={[t('policy.policy_name'), t('policy.policy_number'), t('policy.policy_sum_assured'), t('policy.policy_term') || 'Term', t('policy.policy_premium_term') || 'PPT', t('policy.policy_status')]}>
                            {data.policy.previousPolicies.map((p, i) => (
                                <tr key={i} className="break-inside-avoid border-b border-gray-200">
                                    <td className="border-r border-gray-300 p-1">{p.policyName}</td>
                                    <td className="border-r border-gray-300 p-1">{p.policyNumber}</td>
                                    <td className="border-r border-gray-300 p-1">{p.sumAssured ? `Rs. ${p.sumAssured.toLocaleString('en-IN')}` : 'N/A'}</td>
                                    <td className="border-r border-gray-300 p-1">{p.term || 'N/A'}</td>
                                    <td className="border-r border-gray-300 p-1">{p.premiumPayingTerm || 'N/A'}</td>
                                    <td className="p-1">{p.status}</td>
                                </tr>
                            ))}
                        </Table>
                    </Section>
                )}

                <Section title={t('pdf.section.medical')}>
                    <Grid>
                        <Cell label={t('family.height')} value={data.medical.height} span={4} />
                        <Cell label={t('family.weight')} value={data.medical.weight} span={4} />
                        <Cell label={t('family.birth_mark')} value={data.medical.birthMark} span={4} />
                        
                        <Cell label={t('family.treatment_details_general')} value={data.medical.treatmentDetailsGeneral} span={12} />
                        
                        {data.personal.gender === 'Female' && data.personal.maritalStatus === 'married' && (
                            <>
                                <div className="w-full bg-gray-50 border-r border-b border-gray-300 px-2 py-0.5 font-bold text-gray-700 tracking-wider text-[12px] uppercase break-after-avoid float-left">
                                    {t('family.female_details_subheader')}
                                </div>
                                <Cell label={t('family.is_pregnant')} value={data.medical.isPregnant} span={4} />
                                <Cell label={t('family.delivery_mode')} value={data.medical.isPregnant === 'Yes' ? data.medical.deliveryMode : 'N/A'} span={4} />
                                <Cell label={t('family.last_delivery_date')} value={data.medical.lastDeliveryDate ? format(new Date(data.medical.lastDeliveryDate), 'PPP') : 'N/A'} span={4} />
                                
                                <Cell label={t('family.treatment_details')} value={data.medical.treatmentDetails} span={12} />
                                
                                <div className="w-full bg-gray-50 border-r border-b border-gray-300 px-2 py-0.5 font-bold text-gray-700 tracking-wider text-[12px] uppercase break-after-avoid float-left">
                                    {t('family.husband_details_subheader')}
                                </div>
                                <Cell label={t('family.husband_name')} value={data.medical.husbandName_mw} span={4} />
                                <Cell label={t('family.husband_occupation')} value={data.medical.husbandOccupation_mw} span={4} />
                                <Cell label={t('family.husband_income')} value={data.medical.husbandIncome_mw ? `Rs. ${data.medical.husbandIncome_mw.toLocaleString('en-IN')}` : 'N/A'} span={4} />
                            </>
                        )}
                    </Grid>
                </Section>

                {data.remarks && (
                    <Section title={t('pdf.section.remarks')}>
                        <div className="border border-gray-300 p-2 text-gray-800 leading-relaxed font-medium bg-gray-50">
                            {data.remarks}
                        </div>
                    </Section>
                )}
                
                {data.policy.references && data.policy.references.length > 0 && (
                    <Section title={t('pdf.section.references')}>
                        <Table headers={[t('family.ref_name'), t('family.ref_contact'), t('family.ref_address')]}>
                            {data.policy.references.map((n, i) => (
                                <tr key={i} className="break-inside-avoid border-b border-gray-200">
                                    <td className="border-r border-gray-300 p-1 font-bold text-gray-700">{n.name}</td>
                                    <td className="border-r border-gray-300 p-1">{n.contact}</td>
                                    <td className="p-1">{n.address}</td>
                                </tr>
                            ))}
                        </Table>
                    </Section>
                )}
            </PdfPage>
        </div>
    );
};

export default PdfDocument;
