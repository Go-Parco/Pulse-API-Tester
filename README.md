# Readme

<img src="https://i.ibb.co/0cPzFSS/Property-1-Dark.png" alt="Property-1-Dark" border="0" />

For instructions on how this queries code works as well as a breakdown to the methodology with the [query table - `DevReadme.md` here](https://github.com/Go-Parco/OCR/blob/main/DEV_README.mdx).

**Feel free to modify the prettier settings to your liking. I'm not a fan of the current settings and I feel like they changed on me recently somehow.**

## Application

~~As of this time there is no application for this code currently, it is merely a collection of queries for the Parko OCR project.~~ **I have converted this application into a Next.js application for real-time testing and demo-ing of the functions and features built into this application.** Built on typescript, and utlizing packages like zod to validate the queries and provide a structure for the queries to be submitted to the image parser.

Transpilation chart is for local backup only. I shared a copy of the collaborative version via email.

I did create a home page for use in react/nextJS, but i've only used it for testing the Marker conversion function.

## AGENCY STATUS

See Transpilation chart > Completeness tab for breakdown on agency completeness.

In short though:

-   [x] USDA
-   [x] DOD
-   [x] DOE
-   [x] TVA
-   [x] GSA
-   [ ] USPS

## Query Status

-   [x] Completed Query in each repective agencies folder
-   [x] Completed Verification that the master queries type sheet contains all types contained within the transpilation chart. (Two way check)
-   [x] Completed the matching and expanded upon zod type object
-   [ ] Optional - Further validate the codes pertaining to each agency if desired.

### Values not yet figured how to query

-   [ ] DOD > Deductions > Fegli x Current (deduction.fegli.basic)
-   [ ] GSA > Deductions > Current Dental (deduction.fdvv)
-   [ ] GSA > Deductions > Current Medicare (deduction.medicareBeforeTax)
-   [ ] GSA > Deductions > Current OASDI (deduction.oasdi)
-   [ ] GSA > Deductions > Current fedMedEE (deduction.fedMedEE)
-   [ ] DOE > Deductions > Current OASDI Tax (deduction.oasdi)
-   [ ] DOE > Deductions > Addtl Wthld x Federal (deduction.withholdingFed)
-   [ ] DOE > Deductions > Addtl Wthld x State (deduction.withholdingState)

**Note to self - Remember to add .int() to all the zod schemas that are strict numbers and don't contain any decimals**

## Unknown query methods

-   [ ] Figure out how to query tables or index tables
-   [ ] Maybe train our own model eventuallly to do this. I have created my own model using AppleML.
-   [ ] Also, We could experiment with the Tesseract.js / SribeOCR library to see if it can extract tables from images, primarily for GSA / USPS documents. The demo here looks promising:
        [tesseract demo](https://tesseract.projectnaptha.com)
        [tesseract docs](https://github.com/naptha/tesseract.js#tesseractjs)
        Also, if we run into pdf docs, then scribe looks like it could handle the ocr for those.

## Non-Querieing Types

Types that are not specific to querying can be found in the `types` folder > `FileTypes.ts` file. Most of the openAI types are there, as well as the types needed for the frontend to prevent
duplicate types.

# OCR_Parco_Test

## File Upload / URL Upload Issues needed to sort out

-   multi-page pdfs.
-   Checking a url to see if it's a pdf.
-   Converting the pdf to a base64 then to an image, for processing. (Nyckel doesn't like pdfs)
