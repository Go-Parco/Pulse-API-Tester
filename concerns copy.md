# Concerns

<!-- MARK: USDA -->

## USDA

-   [ ] There can be multiple #88's in the main table. Need to check if more than one, and get them all. Query index tables.
-   [ ] FATAL ERROR: The deduction.fdvv pulls an incorrect value if the "Vision Plan" is not in the Earnings and Deductions table.
        It pulls the value from the P/P cell at the very top of the table.
-   [ ] fehbCode is reading the code to the right, not the left of the label. Unsure if this is desired.
-   [ ] The SCD FOR LEAVE can only be a suggested value. If they had a former federal or military job, the SCD would be different from their first day of work at the job pertaining to this paystub.",

### USDA - Just verifying

### USDA - Problems

<!-- MARK: Department of Defence -->

## DOD

-   [ ] Can't find the Pay Period Start

### DOD - Questions

-   [ ] is the FEHB === healthInsurancePremium ?
-   [ ] Rate doesn't match the same typing as USDA. Provided Value: "64.42" from "6. Basic OT Rate". Value from USDA.
-   [ ] basic.rate ( it's a "Basic OT Rate". Not sure if the basic.rate should be overtime or standard hourly pay equivelant.)
-   [ ] codes.deduction.fegli.optionalCode is the Same marker and output as the codes.deduction.fegliBracket. Should be one or the other.

=== "PA"

### DOD - Just verifying

-   [ ] deductions.fdvv and dspContribution are in need of examples.. I'm assuming for a Vision deduction, it would simply be DEDUCTIONS > VISION x CURRENT, but I don't want to assume. For tsp Contrbution, not exactly sure. We do have TSP SAVINGS, but not sure if that belongs as the same or not.

### DOD - Problems

<!-- MARK: Department Of Education -->

## DOE

### DOE - Just verifying

### DOE - Problems

<!-- MARK: GSArafce
 -->

## GSA

### GSA - Just verifying

-   [ ] Verify that the deduction.medicare is always before tax. ( for deductions.medicareBeforeTax)
-   [ ] No Example of GLI Opt A, but if there is no Opt A value on the Leave Statemens it will return the option B value. Could be problematic in representing correct data.

### GSA - Problems

<!-- MARK: TVA -->

## TVA

### TVA - Just verifying

-   [ ] The Core Life Insurance is followed by the total life insurance amount (50k). Similarly, the 00 that follows the Medical and Dental fields seem to be the deductable or copay. If this is correct, these will all change according to each individual statement, so i chose to leave it out... as well as get these values as a seperate field value.
-   [ ] Same thing with "EMPLOYEE\*" in the suppLife Fields and addMsgSpa fields.
-   [ ] In the example document, the 401k is seperated into two fields, and is added in the field "401(k) Employer Automatic". I'm currently pulling the value from that value, but i am assuming that "Employer Automatic" may be conditional on their pay processes setup, and may not appear on every leave statement. What do you think?
-   [ ] Is fegli.basic always after tax?

### TVA - Problems

<!-- MARK: United States Postal Service -->

## USPS

### USPS - Just verifying

### USPS - Problems

-   [ ] FORMATTING MISMATCH - “04 24” does not match “04/24/24” also, We don’t know if this is the start or end. Inserted in start in the transpilation chart.

name the document

Leave and Earnings Statement
client name leave and earning statement. statement date. (forget about)

Voided Check
document type voided check. account statement (edward jones / ameritrade, carol swhab, etc.).

s3 bucket > table docs. user id / filename - assign to bucket. (s3://table-docs/1234/leave-and-earning-statement.pdf)

document uploader.
parameters to go in.
