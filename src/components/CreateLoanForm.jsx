import {useEffect,useState } from "react";
import{getAssets} from "../api/assets";
import {getCustomers} from "../api/customers";
import {getEmployees} from "../api/employees";
import {createLoan, getActiveLoans} from "../api/loans";

export default function CreateLoanForm({ onLoanCreated }) {
    const [assets,setAssets] = useState([]);
    const [customers,setCustomers] = useState([]);
    const [employees,setEmployees] = useState([]);
    const [activeLoans,setActiveLoans] = useState([]);
    
    const [assetId,setAssetId] = useState("");
    const [customerId,setCustomerId] = useState("");
    const [employeeId,setEmployeeId] = useState("");
    const [dueDate,setDueDate] = useState("");

    const[error,setError] = useState(null);
    const [submitting,setSubmitting] = useState(false);

    const loadFormData = () => {
        getAssets().then(setAssets).catch(err => console.error("Failed to fetch assets:",err));
        getCustomers().then(setCustomers).catch(err => console.error("Failed to fetch customers:",err));
        getEmployees().then(setEmployees).catch(err => console.error("Failed to fetch employees:",err));
        getActiveLoans().then(setActiveLoans).catch(err => console.error("Failed to fetch active loans:",err));
    };

    useEffect(() => {
        loadFormData();
    },[]);

    const activeAssetIds = new Set(activeLoans.map(loan => loan.assetId));
    const availableAssets = assets.filter(asset =>
        !activeAssetIds.has(asset.id) &&
        (!asset.status || asset.status.toLowerCase() === "available")
    );
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try{
            await createLoan({
                assetId:Number(assetId),
                customerId:Number(customerId),
                employeeId:Number(employeeId),
                dueDate: dueDate,
            });
        
        setAssetId("");
        setCustomerId("");
        setEmployeeId("");
        setDueDate("");

        onLoanCreated?.();
        loadFormData();
        }catch(err){
            const activeLoansAfterSubmit = await getActiveLoans().catch(() => []);
            const loanWasCreated = activeLoansAfterSubmit.some(loan =>
                loan.assetId === Number(assetId) &&
                loan.customerId === Number(customerId) &&
                loan.employeeId === Number(employeeId)
            );

            if (loanWasCreated) {
                setAssetId("");
                setCustomerId("");
                setEmployeeId("");
                setDueDate("");
                onLoanCreated?.();
                loadFormData();
            } else {
                setError(err.response?.data?.message || "Failed to create loan");
            }
        }finally{
            setSubmitting(false);
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <h2>Create New Loan</h2>
            {error && <p style={{color:"red"}}>{error}</p>} 
        <div>
            <label>Asset:</label>
            <select value={assetId} onChange={(e) => setAssetId(e.target.value)}>
                <option value="">Select an asset</option>
                {availableAssets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                        {asset.assetTag} - {asset.name}
                    </option>
                ))}
            </select>
        </div>
        <div>
            <label>Customer:</label>
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                <option value="">Select a customer</option>
                {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                        {customer.fullName}
                    </option>
                ))}
            </select>
        </div>
        <div>
            <label>Processed by Employee:</label>
            <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
                <option value="">Select an employee</option>
                {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                        {employee.fullName}
                    </option>
                ))}
            </select>
        </div>
        <div>
            <label>Due Date:</label>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required        
            />
        </div>
        <button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Loan"}
        </button>
    </form>
    );
}
        

