# Exit on error
$ErrorActionPreference = "Stop"

# Path to Neo4j installation
$NEO4J_HOME = "$HOME\.Neo4jDesktop2\Data\dbmss\dbms-496fccac-05d2-4121-a734-07267bd25656"

# Database name
$DB_NAME = "umbc-academic-database"

# Path to import directory (absolute path = script location)
$IMPORT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Check if Neo4j is running
if (Get-Process -Name "neo4j" -ErrorAction SilentlyContinue) {
    Write-Host "Error: Neo4j appears to be running. Please stop Neo4j before running this import script."
    exit 1
}

# Check for required CSV files
$required_files = @(
    "students.csv","faculty.csv","courses.csv","degrees.csv","terms.csv",
    "requirement_groups.csv","textbooks.csv","prerequisites.csv","leads_to.csv",
    "course_similarity_content.csv","course_similarity_difficulty.csv",
    "student_degree.csv","teaching.csv","completed_courses.csv",
    "enrolled_courses.csv","learning_style_similarity.csv",
    "performance_similarity.csv","requirement_degree.csv",
    "course_requirement.csv","course_term.csv","course_textbooks.csv",
    "page_views.csv","textbook_interactions.csv"
)

foreach ($file in $required_files) {
    if (-not (Test-Path "$IMPORT_DIR\$file")) {
        Write-Host "Error: Required file not found: $file"
        exit 1
    }
}

Write-Host "Starting import process..."
Write-Host "Using Neo4j installation at: $NEO4J_HOME"
Write-Host "Importing from directory: $IMPORT_DIR"
Write-Host "Target database name: $DB_NAME"

# Clean up any existing database files
$DB_PATH = Join-Path $NEO4J_HOME "data\databases\$DB_NAME"
if (Test-Path $DB_PATH) {
    Write-Host "Cleaning up existing database directory..."
    Remove-Item -Recurse -Force $DB_PATH
}

Write-Host "Creating fresh database..."

# Run neo4j-admin import
& "$NEO4J_HOME\bin\neo4j-admin.bat" database import full `
  --nodes="Student=$IMPORT_DIR\students.csv" `
  --nodes="Faculty=$IMPORT_DIR\faculty.csv" `
  --nodes="Course=$IMPORT_DIR\courses.csv" `
  --nodes="Degree=$IMPORT_DIR\degrees.csv" `
  --nodes="Term=$IMPORT_DIR\terms.csv" `
  --nodes="RequirementGroup=$IMPORT_DIR\requirement_groups.csv" `
  --nodes="Textbook=$IMPORT_DIR\textbooks.csv" `
  --relationships="PREREQUISITE_FOR=$IMPORT_DIR\prerequisites.csv" `
  --relationships="LEADS_TO=$IMPORT_DIR\leads_to.csv" `
  --relationships="SIMILAR_CONTENT=$IMPORT_DIR\course_similarity_content.csv" `
  --relationships="SIMILAR_DIFFICULTY=$IMPORT_DIR\course_similarity_difficulty.csv" `
  --relationships="PURSUING=$IMPORT_DIR\student_degree.csv" `
  --relationships="TEACHES=$IMPORT_DIR\teaching.csv" `
  --relationships="COMPLETED=$IMPORT_DIR\completed_courses.csv" `
  --relationships="ENROLLED_IN=$IMPORT_DIR\enrolled_courses.csv" `
  --relationships="SIMILAR_LEARNING_STYLE=$IMPORT_DIR\learning_style_similarity.csv" `
  --relationships="SIMILAR_PERFORMANCE=$IMPORT_DIR\performance_similarity.csv" `
  --relationships="PART_OF=$IMPORT_DIR\requirement_degree.csv" `
  --relationships="FULFILLS=$IMPORT_DIR\course_requirement.csv" `
  --relationships="OFFERED_IN=$IMPORT_DIR\course_term.csv" `
  --relationships="REQUIRES,RECOMMENDS=$IMPORT_DIR\course_textbooks.csv" `
  --relationships="VIEWED_PAGE=$IMPORT_DIR\page_views.csv" `
  --relationships="INTERACTED_WITH=$IMPORT_DIR\textbook_interactions.csv" `
  --delimiter="," `
  --array-delimiter=";" `
  --ignore-empty-strings=true `
  --ignore-extra-columns=true `
  --skip-bad-relationships=true `
  --skip-duplicate-nodes=true `
  --high-parallel-io=on `
  --normalize-types=true `
  --overwrite-destination=true `
  $DB_NAME

if ($LASTEXITCODE -eq 0) {
    Write-Host "Import completed successfully!"
    Write-Host "To use the database, edit neo4j.conf to set dbms.default_database=$DB_NAME"
    Write-Host "Then restart Neo4j."
} else {
    Write-Host "Import failed. Check the error messages above for details."
    exit 1
}
