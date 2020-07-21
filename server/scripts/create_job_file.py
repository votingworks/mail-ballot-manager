"""
Usage (from up one directory):

python -m scripts.create_job_file voters.csv output_job_file.zip ballot-1.pdf ballot-2.pdf

"""

import sys, os, uuid, zipfile, random, tempfile, re
from urllib.parse import urlencode

from util.csv_parse import parse_csv, CSVValueType, CSVColumnType

VOTER_ID = "Voter ID"
BALLOT_STYLE_ID = "Ballot Style ID"
PRECINCT_ID = "Precinct ID"
FIRST_NAME = "First Name"
MIDDLE_NAME = "Middle Name"
LAST_NAME = "Last Name"
NAME_SUFFIX = "Name Suffix"
STREET_1 = "Street 1"
STREET_2 = "Street 2"
CITY = "City"
STATE = "State"
ZIP_CODE = "Zip Code"

VOTER_FIELDS = {
    VOTER_ID: "id",
    BALLOT_STYLE_ID: "ballotStyleId",
    PRECINCT_ID: "precinctId",
    FIRST_NAME: "firstName",
    MIDDLE_NAME: "middleName",
    LAST_NAME: "lastName",
    NAME_SUFFIX: "nameSuffix",
    STREET_1: "street1",
    STREET_2: "street2",
    CITY: "city",
    STATE: "state",
    ZIP_CODE: "zip",
}

VOTERS_COLUMNS = [
    CSVColumnType(VOTER_ID, CSVValueType.TEXT, unique=True),
    CSVColumnType(BALLOT_STYLE_ID, CSVValueType.TEXT),
    CSVColumnType(PRECINCT_ID, CSVValueType.TEXT),
    CSVColumnType(FIRST_NAME, CSVValueType.TEXT),
    CSVColumnType(MIDDLE_NAME, CSVValueType.TEXT, required=False),
    CSVColumnType(LAST_NAME, CSVValueType.TEXT),
    CSVColumnType(NAME_SUFFIX, CSVValueType.TEXT, required=False),
    CSVColumnType(STREET_1, CSVValueType.TEXT),
    CSVColumnType(STREET_2, CSVValueType.TEXT, required=False),
    CSVColumnType(CITY, CSVValueType.TEXT),
    CSVColumnType(STATE, CSVValueType.TEXT),
    CSVColumnType(ZIP_CODE, CSVValueType.TEXT),
]

INSERT_URL = "http://localhost:3000/insert-on-demand"


def html_to_pdf(url, pdf_file):
    os.system(f'node scripts/puppeteer-render-insert.js "{url}" {pdf_file}')


def combine_pdfs(first_pdf, second_pdf, output_pdf):
    os.system(f"pdfunite {first_pdf} {second_pdf} {output_pdf}")


def pdf_get_num_pages(pdf_path):
    line = os.popen(f"pdfinfo {pdf_path} | grep 'Pages:'").read()
    return int(re.match("^Pages: *(\d+)", line).group(1))


# FIXME FIXME FIXME: this is a hack that just rotates
# between two ballots instead of having the real ballot styles
def create_full_ballots(voter_file_path, output_path, ballot_path, ballot_path_2):
    random.seed()

    with tempfile.TemporaryDirectory() as tmpDir:
        print(f"{tmpDir} is the dir")

        zf = zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED)
        voters_manifest_path = f"{tmpDir}/voters.manifest"
        voters_manifest = open(voters_manifest_path, "w")

        with open(voter_file_path, "r") as voter_file:
            voters_csv = parse_csv(voter_file.read(), VOTERS_COLUMNS)

            total_num_files = 0
            total_num_pages = 0

            for row in voters_csv:
                fields = {value: row[key] for (key, value) in VOTER_FIELDS.items()}
                full_url = INSERT_URL + "?" + urlencode(fields)
                print("full url is " + full_url)

                voter_uuid = str(uuid.uuid4())
                insert_path = f"{tmpDir}/{voter_uuid}-insert.pdf"
                full_filename = f"{voter_uuid}.pdf"
                full_path = f"{tmpDir}/{full_filename}"

                html_to_pdf(full_url, insert_path)

                ballot_choice = random.choice([ballot_path, ballot_path_2])
                combine_pdfs(insert_path, ballot_choice, full_path)

                num_pages = pdf_get_num_pages(full_path)

                voters_manifest.write(f"{full_filename},{num_pages}\n")

                zf.write(full_path, full_filename)

                total_num_pages += num_pages
                total_num_files += 1

        voters_manifest.write(f"{total_num_files},{total_num_pages}\n")

        voters_manifest.close()
        zf.write(voters_manifest_path, "voters.manifest")
        zf.close()


if __name__ == "__main__":
    create_full_ballots(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
