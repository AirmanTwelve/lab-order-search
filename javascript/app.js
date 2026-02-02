function performSearch() {
    const htn = ["acebutolol", "atenolol", "betaxolol", "bisoprolol", "carvedilol", "labetalol", "metoprolol", "nadolol", "nebivolol", "penbutolol", "pindolol", "propranolol"];
    const gout = ["colchicine", "allupurinol"];
    const osteoporosis = ["prolia", "bisphosphate"];
    const diabetes = ["trulicity", "metformin", "insulin", "jardiance", "januvia", "tirzepatide", "semaglutide"];
    const testicular = ["androgel", "depotestosterone"];
    const thyroid = ["levothyroxine", "liothyronine", "thyroid", "methimazole", "tapazole", "propylthiouracil", "armour"];

    const med_list_unfiltered_input = document.getElementById('medication-list').value.toLowerCase().trim();

    if (!med_list_unfiltered_input) { 
        console.log("Medications: No Input");
    }

    const med_list_array = med_list_unfiltered_input.replace(/[^a-zA-Z0-9]/g, " ").split(/\s+/);

    const on_htn_meds = med_list_array.some(word => htn.includes(word.toLowerCase()));
    const on_gout_meds = med_list_array.some(word => gout.includes(word.toLowerCase()));
    const on_osteoporosis_meds = med_list_array.some(word => osteoporosis.includes(word.toLowerCase()));
    const on_diabetes_meds = med_list_array.some(word => diabetes.includes(word.toLowerCase()));
    const on_testicular_meds = med_list_array.some(word => testicular.includes(word.toLowerCase()));
    const on_thyroid_meds = med_list_array.some(word => thyroid.includes(word.toLowerCase()));

    req_labs = req_labs.concat(pcm_labs);
    console.log(med_list_array);
    console.log("PCM Preferred Labs: ", pcm_labs.join(", "));

    if (pt_age >= 35) {
        if (pt_age > 54 && pt_sex == "Male") { req_labs.push("PSA"); }
        if (on_htn_meds) { req_labs.push("BMP", "Lipid Panel"); }
        if (on_gout_meds) { req_labs.push("Uric Acid"); }
        if (on_osteoporosis_meds) { req_labs.push("25-Hydroxyvitamin D", "Calcium"); }
        if (on_diabetes_meds) { req_labs.push("A1c", "Microalbumin Panel", "CBC", "BMP", "Lipid Panel"); }
        if (on_testicular_meds) { req_labs.push("Testosterone", "LFT", "Lipid Panel", "PSA", "H&H"); }
        if (on_thyroid_meds) { req_labs.push("TSH"); }
    }
    else {
        req_labs = [];
        req_labs.push("Patient is not required to complete any Annual Labs until the age of 35; Unless provider advised otherwise.")
    }

    const unique_array = [...new Set(req_labs)];
    filtered_array = unique_array.filter(function (e) { return e; });
    document.getElementById("output").innerHTML = `${filtered_array.join(', ')}`;

    console.log("Patient Age: ", pt_age);
    console.log("Patient Gender: ", pt_sex);
    console.log("All Labs to be Ordered: ", filtered_array.join(", "));

    req_labs = [];
    unique_array = [];
}

const pcm = document.getElementById("pcm");
const age = document.getElementById("age");
const sex = document.getElementById("sex");

let pt_age, pt_sex, pcm_labs, pcm_labs_x;
let req_labs = [], filtered_array = [];

const pcm_pref_baseline_labs = {
    aa: ["Dr. AA (Placeholder)", "A1c", "Lipid Panel"],
    ab: ["Dr. AB (Placeholder)", "A1c", "Lipid Panel"],
    ac: ["Dr. AC (Placeholder)", "A1c", "Lipid Panel"],
    ad: ["Dr. AD (Placeholder)", "A1c", "Lipid Panel", "BMP"],
    ae: ["Dr. AE (Placeholder)", "A1c", "Lipid Panel", "BMP"],
    af: ["Dr. AF (Placeholder)", "A1c", "Lipid Panel", "CMP", "CBC", "TSH"],
};

pcm.innerHTML += Object.entries(pcm_pref_baseline_labs).map(([key, value]) => `<option value="${key}">${value[0]}</option>`).join('');
age.innerHTML += Array.from({ length: 99 }, (_, i) => { const n = (i + 1).toString().padStart(2, '0'); return `<option value="${n}">${n}</option>`; }).join('');

age.addEventListener("change", function () { 
    pt_age = this.value; 
});
sex.addEventListener("change", function () { 
    pt_sex = this.value; 
});
pcm.addEventListener("change", function () {
    const pcm_value = this.value; if (pcm_value && pcm_pref_baseline_labs[pcm_value]) {
        pcm_labs_x = pcm_pref_baseline_labs[pcm_value]; console.log("PCM:", pcm_pref_baseline_labs[pcm_value][0])
        pcm_labs = pcm_labs_x.slice(1);
    }
});