# WSDL Discovery Tool

A powerful tool to discover WSDL (Web Services Description Language) endpoints from user-provided domains.

## Description

This tool performs comprehensive scanning to discover WSDL endpoints on a given domain. It uses multiple discovery techniques to find SOAP web service endpoints.

## Features

- 🔍 **Multiple Discovery Methods**:
  - Common WSDL path scanning
  - Sitemap.xml parsing
  - Robots.txt analysis
  - Directory traversal (common service paths)
  - WSDL file detection

- 🎯 **Targeted Scanning**:
  - Scans common web service directories
  - Checks for standard WSDL naming conventions
  - Validates WSDL files by parsing XML structure

- 📊 **Detailed Results**:
  - Lists all discovered WSDL endpoints
  - Shows service descriptions
  - Displays available operations
  - Exports results to JSON

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

Then enter the domain you want to scan when prompted.

### Example

```
Enter domain to scan: example.com

🔍 Scanning example.com for WSDL endpoints...

✅ Found WSDL: https://example.com/services/UserService?wsdl
   Service: UserService
   Operations: getUser, createUser, updateUser

✅ Found WSDL: https://example.com/api/PaymentService?wsdl
   Service: PaymentService
   Operations: processPayment, refund

📊 Total WSDL endpoints found: 2
```

## Discovery Methods

### 1. Common Path Scanning
Scans commonly used paths for web services:
- `/services/`
- `/webservices/`
- `/api/`
- `/soap/`
- `/ws/`

### 2. Common File Names
Checks for standard WSDL naming patterns:
- `*.wsdl`
- `*Service?wsdl`
- `*WebService?wsdl`

### 3. Sitemap Parsing
Analyzes sitemap.xml for WSDL references

### 4. Robots.txt Analysis
Checks robots.txt for service paths

## Ethical Use

**IMPORTANT**: This tool should only be used on domains you own or have explicit permission to scan. Unauthorized scanning may violate terms of service and local laws.

- Only scan domains you have permission to test
- Respect rate limits and server resources
- Do not use for malicious purposes
- Follow responsible disclosure practices

## Output

Results are displayed in the console and can be saved to a JSON file for further analysis.

## License

MIT
