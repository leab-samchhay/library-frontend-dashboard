import { GlobleContext } from '@/globleContext/GlobleContext'
import api from '@/service/api';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from '@base-ui/react/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from "@/components/ui/toast";
import { TiArrowBackOutline } from "react-icons/ti";
import { MdOutlineSaveAlt } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { QrCode } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import KhqrPaymentModal from '@/components/KhqrPaymentModal';

const FinesPaymentCreate = () => {
    const {isDarkMode} = useContext(GlobleContext);
    const authUser = useSelector((state) => state.auth?.user);
    const user = authUser || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    const [Loading,setLoading] = useState(false);
    const [showKhqrModal, setShowKhqrModal] = useState(false);
    const navigate = useNavigate();

    const {id} = useParams();
    const isEditeMode = Boolean(id);

    const [form,setForm] = useState({
        fine_id: "",
        amount: "",
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: "ABA KHQR",
        received_by: user?.id ? String(user.id) : "",
        note: ""
    });

    const [finesData, setFinesData] = useState([]);

    const getDependencies = async () => {
        try {
            const res = await api.get('fines');
            setFinesData(res.data.data.data || res.data.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    const getData = async()=>{
        try{
            setLoading(true);
            const res = await api.get(`fine-payments/${id}`);
            const result = res.data.data;
            setForm({
                fine_id: result.fine_id || "",
                amount: result.amount || "",
                payment_date: result.payment_date || "",
                payment_method: result.payment_method || "ABA KHQR",
                received_by: result.received_by || (user?.id ? String(user.id) : ""),
                note: result.note || ""
            });
        }
        catch(error){
            console.log(error)
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        getDependencies();
        if(isEditeMode){
            getData();
        } else if(user?.id) {
            setForm(prev => {
                if(!prev.received_by) {
                    return {...prev, received_by: String(user.id)};
                }
                return prev;
            });
        }
    },[id,isEditeMode,user])

    const handleReset = () => {
        setForm({
            fine_id: "",
            amount: "",
            payment_date: new Date().toISOString().split('T')[0],
            payment_method: "ABA KHQR",
            received_by: user?.id ? String(user.id) : "",
            note: ""
        });
    };

    const handleInput = (e) => {
        const {name,value} = e.target;
        setForm((pre) => ({...pre,[name]: value}));
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();

        // ប្រសិនបើជ្រើសរើស ABA KHQR ត្រូវបើកផ្ទាំង QR ស្កេន
        if (!isEditeMode && form.payment_method === "ABA KHQR") {
            if (!form.fine_id || !form.amount) {
                if (toast && toast.add) {
                    toast.add({
                        type: "error",
                        description: "សូមជ្រើសរើស Fine ID និងបញ្ចូលចំនួនទឹកប្រាក់ជាមុនសិន!",
                        timeout: 3000,
                    });
                }
                return;
            }
            setShowKhqrModal(true);
            return;
        }

        try{
            setLoading(true);
            let res ;
            if(isEditeMode){
                res = await api.put(`fine-payments/${id}`,form);
            }
            else{
                res = await api.post('fine-payments',form);
            }

            if (toast && toast.add) {
                toast.add({
                    type: "success",
                    description: res.data?.message || "Payment has been saved successfully.",
                    timeout: 3000,
                });
            }
            handleReset();
            navigate('/finesPayment')
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }

    // ដំណើរការរក្សាទុកទិន្នន័យពេលស្កេន / តេស្តបង់ប្រាក់ជោគជ័យតាម ABA KHQR
    const handleKhqrSuccess = async (paymentData) => {
        try {
            setLoading(true);
            const payload = {
                ...form,
                payment_method: 'ABA KHQR',
                note: (form.note ? form.note + ' | ' : '') + `ABA TranID: ${paymentData?.tran_id || 'N/A'}`
            };

            const res = await api.post('fine-payments', payload);

            if (toast && toast.add) {
                toast.add({
                    type: "success",
                    description: "ការទូទាត់ប្រាក់តាម ABA KHQR ទទួលបានជោគជ័យ!",
                    timeout: 3000,
                });
            }
            handleReset();
            navigate('/finesPayment');
        } catch (error) {
            console.error('Error saving KHQR payment:', error);
            if (toast && toast.add) {
                toast.add({
                    type: "error",
                    description: error.response?.data?.message || "បរាជ័យក្នុងការកត់ត្រាការទូទាត់ប្រាក់",
                    timeout: 3000,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={`flex justify-between items-center bg-blend-darken p-4 mb-5 ${isDarkMode ? "bg-blue-500/20" : "bg-blue-500/80"} rounded-sm`}>
                <div className={`text-2xl text-white ${isDarkMode ? " text-white/60" : "text-white"}`}>
                    {isEditeMode ? "Update Fine Payment" : "Create Fine Payment"}
                </div>
                <button 
                    onClick={()=>navigate('/finesPayment')}
                    className={`flex items-center duration-300 gap-2 ${isDarkMode ? "bg-black/30 text-white/60" : "bg-white"} rounded-xs hover:bg-pink-300 cursor-pointer hover:text-white text-blue-500/80 px-2 py-1`}
                >
                    <span className='text-xl font-bold'><TiArrowBackOutline /></span>
                    <span>Back</span>
                </button>
            </div>

            <div className={` ${isDarkMode ? " bg-white/2 text-white/50 " : " bg-white "} rounded-sm mx-auto mt-10 p-6 shadow-sm border-2`}>
                <form onSubmit={handleSubmit}>
                    <Field className='grid grid-cols-1 md:grid-cols-2 gap-x-4'>
                        <div>
                            <FieldLabel htmlFor="fine_id">Fine ID</FieldLabel>
                            <Select 
                                value={form.fine_id !== "" && form.fine_id !== null && form.fine_id !== undefined ? String(form.fine_id) : ""}
                                onValueChange={(val) => {
                                    const selectedFine = finesData.find((e) => String(e.id) === String(val));
                                    setForm((pre) => ({
                                        ...pre,
                                        fine_id: Number(val),
                                        amount: selectedFine ? selectedFine.amount : pre.amount,
                                        payment_date: new Date().toISOString().split('T')[0]
                                    }));
                                }}
                            >
                                <SelectTrigger className="w-full rounded-sm mb-4 py-5">
                                    <SelectValue placeholder="Select Fine ID">
                                        {form.fine_id ?
                                            finesData.find((e) => String(e.id) === String(form.fine_id))?.id ? `Fine #${form.fine_id}` : "Unknown"
                                            : "Select Fine ID"
                                        }
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup >
                                        {finesData.filter(item => item.status !== "Paid" || String(item.id) === String(form.fine_id)).map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                Fine #{item.id} - ${item.amount}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <FieldLabel htmlFor="amount">Amount ($)</FieldLabel>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                name="amount"
                                value={form.amount}
                                onChange={handleInput}
                                placeholder="Input amount"
                                className="rounded-sm mb-4 py-5"
                                required
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="payment_date">Payment Date</FieldLabel>
                            <Input
                                id="payment_date"
                                type="date"
                                name="payment_date"
                                value={form.payment_date}
                                onChange={handleInput}
                                className="rounded-sm mb-4 py-5"
                                required
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="received_by">
                                Received By {user?.name && <span className="text-xs font-normal opacity-70">({user.name})</span>}
                            </FieldLabel>
                            <Input
                                id="received_by"
                                type="text"
                                name="received_by"
                                value={form.received_by}
                                readOnly
                                placeholder="Input receiver ID"
                                className={`rounded-sm mb-4 py-5 cursor-not-allowed opacity-75 ${isDarkMode ? 'bg-black/40 border-gray-600 text-white' : 'bg-gray-100'}`}
                            />
                        </div>
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <div>
                            <FieldLabel htmlFor="payment_method">Payment Method</FieldLabel>
                            <select
                                id="payment_method"
                                name="payment_method"
                                value={form.payment_method}
                                onChange={handleInput}
                                className={`w-full border rounded-sm mb-4 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300'}`}
                            >
                                <option value="ABA KHQR">ABA KHQR (Scan with Bakong / Mobile Banking)</option>
                                <option value="Cash">Cash (សាច់ប្រាក់សុទ្ធ)</option>
                            </select>
                        </div>

                        <div>
                            <FieldLabel htmlFor="note">Note</FieldLabel>
                            <textarea 
                                id="note"
                                name="note"
                                rows={2}
                                value={form.note}
                                onChange={handleInput}
                                placeholder="Input note (optional)" 
                                className={`w-full border rounded-sm p-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-gray-300'}`}
                            />
                        </div>
                    </div>

                    <div className='flex gap-2 items-center'>
                        <Button 
                            type="submit" 
                            disabled={Loading} 
                            className={`${isDarkMode ? " bg-blue-500/40 text-white/60 " : " bg-blue-500/80 text-white "} hover:bg-blue-700 duration-300 px-5 py-2.5 rounded-sm flex justify-center items-center gap-2 mt-2 cursor-pointer font-medium disabled:opacity-50`}
                        >
                            <span className='text-xl'>
                                {isEditeMode ? <BiSolidEdit /> : (form.payment_method === 'ABA KHQR' ? <QrCode size={18} /> : <MdOutlineSaveAlt />)}
                            </span>
                            {isEditeMode ? "Update" : (form.payment_method === 'ABA KHQR' ? "Generate KHQR & Pay" : "Create")} {Loading && <Spinner />}
                        </Button>

                        <Button
                            onClick={handleReset}
                            type="reset" 
                            className= {` ${isDarkMode ? "text-white/60" : "text-black"} border-2 hover:bg-gray-100 duration-300 px-4 py-2.5 rounded-sm flex justify-center items-center gap-2 mt-2 cursor-pointer font-medium disabled:opacity-50`}
                        >
                            Reset
                        </Button>
                    </div>
                </form>
            </div>

            {/* ABA KHQR Payment Modal */}
            <KhqrPaymentModal
                isOpen={showKhqrModal}
                onClose={() => setShowKhqrModal(false)}
                amount={form.amount || "1.00"}
                merchantName="BBU LIBRARY"
                fineId={form.fine_id}
                onPaymentSuccess={handleKhqrSuccess}
            />
        </div>
    )
}

export default FinesPaymentCreate
