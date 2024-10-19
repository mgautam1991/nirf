
function getFormData() {
    return JSON.parse(localStorage.getItem('formData')) || formData;
}

let calculateDerivedValuestlr = () => {
    // Student Strength
    let student_strength = getFormData().total_enrolled_students / getFormData().total_sanctioned_intake * 20;

    // Faculty-Student Ratio
    let faculty_student_ratio = (getFormData().full_time_faculty_previous_year / getFormData().total_sanctioned_intake < 0.01428571)
        ? 0
        : (getFormData().full_time_faculty_previous_year / getFormData().total_sanctioned_intake) * 20 * 30;

    // Percentage of Faculty with PhD
    let percentage_of_faculty_with_phd = (getFormData().faculty_with_phd / getFormData().total_faculty) * 100;

    // Faculty Quality (FQ)
    let fq = (percentage_of_faculty_with_phd > 75)
        ? 10
        : 10 * (percentage_of_faculty_with_phd / 75);

    // Faculty Experience Distribution (F1, F2, F3)
    let faculty_upto_8_years_percentage = (getFormData().faculty_upto_8_years / getFormData().total_faculty);
    let faculty_between_8_to_15_years_percentage = (getFormData().faculty_between_8_15_years / getFormData().total_faculty);
    let faculty_more_than_15_years_percentage = (getFormData().faculty_more_than_15_years / getFormData().total_faculty);

    // Faculty Experience Score (FE)
    let fe = 3 * Math.min(3 * faculty_upto_8_years_percentage, 1)
        + 3 * Math.min(3 * faculty_between_8_to_15_years_percentage, 1)
        + 4 * Math.min(3 * faculty_more_than_15_years_percentage, 1);

    // Financial Resources (FRU)
    let updated_latest_cap_avg = ((getFormData().avg_annual_cap_exp_3_years * 3)
        - getFormData().last_year_cap_exp + getFormData().this_year_cap_exp) / 3;

    let updated_latest_ops_avg = ((getFormData().avg_annual_ops_exp_3_years * 3)
        - getFormData().last_year_ops_exp + getFormData().this_year_ops_exp) / 3;

    // % Increase/Decrease in Capex/Opex
    let capex_percentage_change = ((updated_latest_cap_avg / getFormData().avg_annual_cap_exp_3_years) - 1) * 100;
    let opex_percentage_change = ((updated_latest_ops_avg / getFormData().avg_annual_ops_exp_3_years) - 1) * 100;

    // Impact of Percentage Changes
    let impact_capex_change = capex_percentage_change * 0.25;
    let impact_opex_change = opex_percentage_change * 0.75;

    // FRU Calculation for This Year
    let this_year_fru = getFormData().last_year_fru + getFormData().last_year_fru * (impact_capex_change + impact_opex_change) / 100;

    // Gaps for Optimal Faculty and Student Strength
    let optimal_student_strength = getFormData().total_sanctioned_intake;
    let student_strength_gap = getFormData().total_sanctioned_intake - getFormData().total_enrolled_students;

    let optimal_faculty_strength = getFormData().total_sanctioned_intake / 20;
    let faculty_strength_gap = Math.max(0, optimal_faculty_strength - getFormData().full_time_faculty_previous_year);

    // Optimal Faculty with PhD and Equivalent Qualification
    let optimal_faculty_with_phd = optimal_faculty_strength * 0.75;
    let faculty_with_phd_gap = Math.max(0, optimal_faculty_with_phd - getFormData().faculty_with_phd);

    // Optimal Faculty Experience Gaps
    let optimal_faculty_with_upto_8_years = getFormData().full_time_faculty_previous_year * 0.33;
    let faculty_upto_8_years_gap = Math.max(0, optimal_faculty_with_upto_8_years - getFormData().faculty_upto_8_years);

    let optimal_faculty_with_8_to_15_years = getFormData().total_faculty * 0.33;
    let faculty_8_to_15_years_gap = Math.max(0, optimal_faculty_with_8_to_15_years - getFormData().faculty_between_8_15_years);

    let optimal_faculty_with_more_than_15_years = getFormData().total_faculty * 0.33;
    let faculty_more_than_15_years_gap = Math.max(0, optimal_faculty_with_more_than_15_years - getFormData().faculty_more_than_15_years);

    return {
        student_strength,
        faculty_student_ratio,
        percentage_of_faculty_with_phd,
        fq,
        faculty_upto_8_years_percentage,
        faculty_between_8_to_15_years_percentage,
        faculty_more_than_15_years_percentage,
        fe,
        updated_latest_cap_avg,
        updated_latest_ops_avg,
        capex_percentage_change,
        opex_percentage_change,
        impact_capex_change,
        impact_opex_change,
        this_year_fru,
        optimal_student_strength,
        student_strength_gap,
        optimal_faculty_strength,
        faculty_strength_gap,
        optimal_faculty_with_phd,
        faculty_with_phd_gap,
        optimal_faculty_with_upto_8_years,
        faculty_upto_8_years_gap,
        optimal_faculty_with_8_to_15_years,
        faculty_8_to_15_years_gap,
        optimal_faculty_with_more_than_15_years,
        faculty_more_than_15_years_gap
    };
};




let calculateDerivedTLR = () => {
    // Invoke the calculation to initialize derived values
    let derivedValuestlr = calculateDerivedValuestlr();

    // Now calculate the RPP value using the derived metrics from Publications
    let tlr_value = (
        derivedValuestlr.student_strength +
        derivedValuestlr.faculty_student_ratio +
        (derivedValuestlr.fq + derivedValuestlr.fe) +
        derivedValuestlr.this_year_fru
    );

    return {
        value: tlr_value
    };
};

let calculateDerivedPublications = () => {
    // Input values from getFormData() or derived values
    let number_of_publications = getFormData().num_publications;  // Sheet2!C18
    let frq = getFormData().total_sanctioned_intake / 20;  // H12/20 (max faculty per student for 1:20)

    // Function for P/FRQ (P = Publications, FRQ = Faculty Student Ratio)
    let publications_per_frq = (getFormData().num_publications / frq) / 4;

    // Combined metric for Publications (PU)
    let combined_metric_pu = publications_per_frq * 70;

    // Total number of citations in Web of Science and Scopus
    let citations_web_of_science = getFormData().citations_web_of_science;  // Sheet2!C19
    let citations_scopus = getFormData().citations_scopus;  // Sheet2!C20

    // Function for Quality of Publications (QP)
    let qp_function=
        ((50 * getFormData().citations_web_of_science / getFormData().num_publications) +
        (50 * getFormData().citations_scopus / getFormData().num_publications));
    let combined_metric_qp = (qp_function * 30 / 100) 
    

    // Optimal and gap calculations
    let optimal_number_of_publications = getFormData().total_faculty * 4;  // L13 * 4
    let gap_publications = (getFormData().total_faculty * 4) - getFormData().num_publications;

    let optimal_number_of_citations = getFormData().total_faculty;  // L23
    let gap_citations = (getFormData().total_faculty - getFormData().citations_web_of_science - getFormData().citations_scopus);

    return {
        number_of_publications,
        frq,
        publications_per_frq,
        combined_metric_pu,
        citations_web_of_science,
        citations_scopus,
        combined_metric_qp,
        optimal_number_of_publications,
        gap_publications,
        optimal_number_of_citations,
        gap_citations
    };
};

let calculateDerivedRPP = () => {
    // Calculate derived publications metrics first
    let derivedPublications = calculateDerivedPublications();

    // Now calculate the RPP value using the derived metrics from Publications
    let rpp_value = (
        derivedPublications.combined_metric_pu + 
        derivedPublications.combined_metric_qp
    );

    return {
        value: rpp_value
    };
};

let calculateDerivedPlacementAndHigherStudies = () => {
    // Combined metric for Placement and Higher Studies (GPH)
    let combined_metric_gph = 40 * ((getFormData().students_placed_3_years / 100) + (getFormData().students_higher_studies / 100));

    // Metric for University Examinations (GUE)
    let metric_gue = 40 * Math.min((getFormData().students_passing_time / 80), 1);

    // Median Salary (GMS)
    let median_salary_gms = (getFormData().median_salary_graduates / 20) * 20;

    // Optimal and gap calculations
    let optimal_percentage_placement_hs = 100;
    let gap_placement_hs = optimal_percentage_placement_hs - (getFormData().students_placed_3_years + getFormData().students_higher_studies);

    let optimal_percentage_passing_students = 100;
    let gap_passing_students = optimal_percentage_passing_students - getFormData().students_passing_time;

    let optimal_salary_graduates = 15;
    let gap_salary_graduates = optimal_salary_graduates - getFormData().median_salary_graduates;

    return {
        combined_metric_gph,
        metric_gue,
        median_salary_gms,
        gap_placement_hs,
        gap_passing_students,
        gap_salary_graduates
    };
};

let calculateDerivedGO = () => {
    // Get the calculated values from Placement and Higher Studies
    let derivedPlacementAndHigherStudies = calculateDerivedPlacementAndHigherStudies();

    // Calculate the GO value using the derived metrics
    let go_value = (
        derivedPlacementAndHigherStudies.combined_metric_gph +
        derivedPlacementAndHigherStudies.metric_gue +
        derivedPlacementAndHigherStudies.median_salary_gms
    );

    return {
        value: go_value
    };
};

let calculateDerivedDiversityAndSupportMetrics = () => {
    // Percentage of Students from Other States/Countries (Region Diversity RD)
    let region_diversity_rd = ((25 * getFormData().students_other_states / 100) + (5 * getFormData().students_other_countries / 100));

    // Number of students from other states and other countries
    let num_students_other_states = getFormData().total_enrolled_students * (getFormData().students_other_states / 100);
    let num_students_other_countries = getFormData().total_enrolled_students * (getFormData().students_other_countries / 100);

    // Percentage of Women (Women Diversity WD)
    let women_diversity_wd = 15 * (getFormData().women_students / 50) + 15 * (getFormData().women_faculties / 20);

    // Number of women students and faculties
    let num_women_students = getFormData().total_enrolled_students * (getFormData().women_students / 100);
    let num_women_faculties = getFormData().total_faculty * (getFormData().women_faculties / 100);

    // Economically and Socially Challenged Students (ESCS)
    let escs = 20 * (getFormData().ug_students_reimbursement / 50);

    // Number of UG students provided with full reimbursement
    let num_ug_students_reimbursement = getFormData().total_enrolled_students * (getFormData().ug_students_reimbursement / 100);

    // Facilities for Physically Challenged Students (PCS)
    let pcs = Math.min(20, 20 * (50 * getFormData().buildings_with_lifts_ramps / 80 + 40 * getFormData().walking_aids_between_buildings / 80 + 10 * getFormData().toilets_handicapped_students / 80) / 100);

    // Optimal and gap calculations
    let optimal_num_students_other_states = getFormData().total_enrolled_students * 0.50;
    let gap_students_other_states = optimal_num_students_other_states - (getFormData().students_other_states + getFormData().students_other_countries);

    let optimal_women_students = getFormData().total_enrolled_students * 0.50;
    let gap_women_students = optimal_women_students - getFormData().women_students;

    let optimal_women_faculties = getFormData().total_faculty * 0.20;
    let gap_women_faculties = optimal_women_faculties - getFormData().women_faculties;

    let optimal_ug_students_reimbursement = getFormData().total_enrolled_students * 0.50;
    let gap_ug_students_reimbursement = optimal_ug_students_reimbursement - getFormData().ug_students_reimbursement;

    return {
        region_diversity_rd,
        num_students_other_states,
        num_students_other_countries,
        women_diversity_wd,
        num_women_students,
        num_women_faculties,
        escs,
        num_ug_students_reimbursement,
        pcs,
        gap_students_other_states,
        gap_women_students,
        gap_women_faculties,
        gap_ug_students_reimbursement
    };
};

let calculateDerivedOI = () => {
    // Get the calculated values from Diversity and Support Metrics
    let derivedDiversityAndSupportMetrics = calculateDerivedDiversityAndSupportMetrics();

    // Calculate the OI value using the derived metrics
    let oi_value = (
        derivedDiversityAndSupportMetrics.region_diversity_rd +
        derivedDiversityAndSupportMetrics.women_diversity_wd +
        derivedDiversityAndSupportMetrics.escs +
        derivedDiversityAndSupportMetrics.pcs
    );

    return {
        value: oi_value
    };
};

let calculateDerivedPP = () => {
    // Peer Perception value directly from getFormData()
    let peer_perception_value = getFormData().peer_perception;

    // Return the calculated PP value
    return {
        value: peer_perception_value
    };
};


let calculateNIRF = () => {
    let derivedTLR = calculateDerivedTLR();
    let derivedRPP = calculateDerivedRPP();
    let derivedGO = calculateDerivedGO();
    let derivedOI = calculateDerivedOI();
    let derivedPP = calculateDerivedPP();
    
    let totalSum = derivedTLR.value*0.4 + derivedRPP.value*0.15 + derivedGO.value*0.25 + derivedOI.value*0.1 + derivedPP.value*0.1;
    
    // Log each derived value with a meaningful label
    console.log("Derived TLR Value:", derivedTLR.value);
    console.log("Derived RPP Value:", derivedRPP.value);
    console.log("Derived GO Value:", derivedGO.value);
    console.log("Derived OI Value:", derivedOI.value);
    console.log("Derived PP Value:", derivedPP.value);
    
    // Log the total sum of all derived values
    console.log("NIRF:", totalSum);

    return {
        value: totalSum
    };
}

calculateNIRF();


let calculateSuggestions = () => {
    let suggestions = [];
    let derivedTLR = calculateDerivedValuestlr();
    let derivedRPP = calculateDerivedPublications();
    let derivedGO = calculateDerivedPlacementAndHigherStudies();
    let derivedOI = calculateDerivedDiversityAndSupportMetrics();
    let derivedPP = calculateDerivedPP();

    
    // Suggestion 1: Increase student enrollment
    if (derivedTLR.student_strength_gap > 0) {
        let student_enrollment = Math.ceil(derivedTLR.student_strength_gap);
        suggestions.push(`Increase student enrollment by ${student_enrollment} students.`);
    }

    // Suggestion 2: Hire additional faculty members
    if (derivedTLR.faculty_strength_gap > 0) {
        let additional_faculty = Math.ceil(derivedTLR.faculty_strength_gap);
        suggestions.push(`Hire ${additional_faculty} additional faculty members.`);
    }

    // Suggestion 3: Hire more PhD-qualified faculty
    if (derivedTLR.faculty_with_phd_gap > 0) {
        let phd_faculty = Math.ceil(derivedTLR.faculty_with_phd_gap);
        suggestions.push(`Hire ${phd_faculty} more PhD-qualified faculty.`);
    }

    // Suggestion 4: Hire female faculty members
    if (derivedOI.gap_women_faculties > 0) {
        let female_faculty = Math.ceil(derivedOI.gap_women_faculties);
        suggestions.push(`Hire ${female_faculty} female faculty members to increase diversity.`);
    }

    // Suggestion 5: Hire faculty with different years of experience
    let facultyExperienceSuggestion = '';
    if (derivedTLR.faculty_upto_8_years_gap > 0) {
        facultyExperienceSuggestion += `Hire ${Math.ceil(derivedTLR.faculty_upto_8_years_gap)} faculty with up to 8 years of experience. `;
    }
    if (derivedTLR.faculty_8_to_15_years_gap > 0) {
        facultyExperienceSuggestion += `Hire ${Math.ceil(derivedTLR.faculty_8_to_15_years_gap)} faculty with 8 to 15 years of experience. `;
    }
    if (derivedTLR.faculty_more_than_15_years_gap > 0) {
        facultyExperienceSuggestion += `Hire ${Math.ceil(derivedTLR.faculty_more_than_15_years_gap)} faculty with more than 15 years of experience. `;
    }
    if (facultyExperienceSuggestion) {
        suggestions.push(facultyExperienceSuggestion.trim());
    }

    // Suggestion 6: Increase publications
    if (derivedRPP.gap_publications > 0) {
        let increase_publications = Math.ceil(derivedRPP.gap_publications);
        suggestions.push(`Increase publications by ${increase_publications} to reach optimal research output.`);
    }

    // Suggestion 7: Increase citations
    if (derivedRPP.gap_citations > 0) {
        let increase_citations = Math.ceil(derivedRPP.gap_citations);
        suggestions.push(`Increase citations by ${increase_citations} to enhance research impact.`);
    }

    // Suggestion 8: Improve placement rate
    if (derivedGO.gap_placement_hs > 0) {
        let improve_placement = Math.ceil(derivedGO.gap_placement_hs);
        suggestions.push(`Improve placement rate by ${improve_placement}% to reach optimal level.`);
    }

    // Suggestion 9: Increase passing rate
    if (derivedGO.gap_passing_students > 0) {
        let increase_passing = Math.ceil(derivedGO.gap_passing_students);
        suggestions.push(`Increase passing rate by ${increase_passing}% to meet optimal graduation rate.`);
    }

    // Suggestion 10: Raise graduate median salary
    if (derivedGO.gap_salary_graduates > 0) {
        let raise_salary = Math.ceil(derivedGO.gap_salary_graduates);
        suggestions.push(`Raise graduate median salary by ₹${raise_salary} lakhs to reach optimal level.`);
    }

    // Suggestion 11: Enroll more students from other states
    if (derivedOI.gap_students_other_states > 0) {
        let enroll_students = Math.ceil(derivedOI.gap_students_other_states);
        suggestions.push(`Enroll ${enroll_students} more students from other states to enhance diversity.`);
    }

    // Suggestion 12: Increase female student enrollment
    if (derivedOI.gap_women_students > 0) {
        let increase_female_students = Math.ceil(derivedOI.gap_women_students);
        suggestions.push(`Increase female student enrollment by ${increase_female_students} to reach target.`);
    }

    // Suggestion 13: Secure full reimbursement for more UG students
    if (derivedOI.gap_ug_students_reimbursement > 0) {
        let reimbursement_students = Math.ceil(derivedOI.gap_ug_students_reimbursement);
        suggestions.push(`Secure full reimbursement for ${reimbursement_students} more UG students.`);
    }

    // Additional static suggestions
    suggestions.push('Set up 2 COE in the college.');
    suggestions.push('Set up 3 Research Labs with Industry collaborations.');
    suggestions.push('Conduct TEDx, conclave, workshops, webinar events.');
    suggestions.push('Conduct Alumni meet to increase industry collaboration.');

    return suggestions;
};

