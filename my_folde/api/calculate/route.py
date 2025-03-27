from http.server import BaseHTTPRequestHandler
import json
import math

def calculate_annuity_payment(principal, rate, term):
    monthly_rate = rate / 12 / 100
    numerator = principal * monthly_rate * (1 + monthly_rate) ** term
    denominator = (1 + monthly_rate) ** term - 1
    return numerator / denominator

def calculate_differential_payment(principal, rate, term, month):
    monthly_rate = rate / 12 / 100
    principal_payment = principal / term
    remaining_principal = principal - (principal_payment * (month - 1))
    interest_payment = remaining_principal * monthly_rate
    return principal_payment + interest_payment

def calculate_schedule(principal, rate, term, payment_type):
    schedule = []
    remaining_balance = principal
    total_payment = 0
    total_interest = 0

    if payment_type == "annuity":
        monthly_payment = calculate_annuity_payment(principal, rate, term)
        for month in range(1, term + 1):
            interest_payment = remaining_balance * (rate / 12 / 100)
            principal_payment = monthly_payment - interest_payment
            remaining_balance -= principal_payment
            
            schedule.append({
                "month": month,
                "payment": monthly_payment,
                "principal": principal_payment,
                "interest": interest_payment,
                "balance": max(0, remaining_balance)
            })
            
            total_payment += monthly_payment
            total_interest += interest_payment
    else:
        for month in range(1, term + 1):
            payment = calculate_differential_payment(principal, rate, term, month)
            principal_payment = principal / term
            interest_payment = payment - principal_payment
            remaining_balance -= principal_payment
            
            schedule.append({
                "month": month,
                "payment": payment,
                "principal": principal_payment,
                "interest": interest_payment,
                "balance": max(0, remaining_balance)
            })
            
            total_payment += payment
            total_interest += interest_payment

    return {
        "monthlyPayment": schedule[0]["payment"],
        "totalPayment": total_payment,
        "totalInterest": total_interest,
        "schedule": schedule
    }

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))

        loan_amount = float(data['loanAmount'])
        interest_rate = float(data['interestRate'])
        loan_term = int(data['loanTerm'])
        payment_type = data['paymentType']
        
        if 'downPayment' in data and data['downPayment']:
            loan_amount -= float(data['downPayment'])

        results = calculate_schedule(loan_amount, interest_rate, loan_term, payment_type)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(results).encode())
        return

