// Imports
import axios from 'axios';
import {router} from 'expo-router';
import 'react-native-get-random-values';
import {AuthContext} from '../../../../context/Auth';
import {useState, useEffect, useContext} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {Text, TouchableOpacity, View, ScrollView, Button, Image} from 'react-native';
import {ActivityIndicator, Snackbar, Icon, Button as PaperButton, Card} from 'react-native-paper';





// Main function
const index = () => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const onDismissSnackBar = () => setVisible(false);


    // User
    const {user, school} = useContext(AuthContext);


    // Selected tab
    const [selectedTab, setSelectedTab] = useState('pay');


    // Is show heads
    const [isShowHeads, setIsShowHeads] = useState(false);


    // States
    const [states, setStates] = useState({
        loading:false,
        loadingData:false
    });


    // Opened dropdown
    const [openedField, setOpenedField] = useState('');


    // Fee details
    const [feeDetails, setFeeDetails] = useState();


    // Fee amounts
    const [totalFee, setTotalFee] = useState(0);
    const [receivedFee, setReceivedFee] = useState(0);
    const [dueFee, setDueFee] = useState(0);
    const [previewHeads, setPreviewHeads] = useState([]);


    // Values
    const [installments, setInstallments] = useState([]);
    const [selectedInstallment, setSelectedInstallment] = useState({label:'', value:''});


    // Installment change handler
    const installmentChangeHandler = item => {
        setSelectedInstallment(item);
        setTotalFee(totalNumberGenerator(previewHeads?.filter(h => h?.amounts && (h.installment === item.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === item.label)?.map(a => Number(a.value))))));
        setReceivedFee(totalNumberGenerator(previewHeads?.filter(h => h?.amounts && (h.installment === item.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === item.label)?.map(a => Number(a.last_rec_amount || 0))))));
        setDueFee(totalNumberGenerator(previewHeads?.filter(h => h?.amounts && (h.installment === item.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === item.label)?.map(a => Number(a.last_rec_amount === a.value ? 0 : a.payable_amount || a.value))))));
        setPreviewHeads(previewHeads.filter(h => h?.amounts && (h.installment === item.label || h.installment === 'All installments')));
    };


    // Fetch data
    const fetchData = async () => {

        // Setting loading data to true
        setStates({...states, loadingData:true});

        // Installments response
        const installmentsLink = `${process.env.EXPO_PUBLIC_API_URL}/installments/names`;
        const installmentsRes = await axios.get(installmentsLink);
        const installmentsDropdownData = installmentsRes.data.map(s => {
            return{
                label:s.name,
                value:s.name.toLowerCase()
            };
        });
        setInstallments(installmentsDropdownData);
        
        
        // Fee details response
        const feeDetailsLink = `${process.env.EXPO_PUBLIC_API_URL}/students/student/fee`;
        const feeDetailsRes = await axios.post(feeDetailsLink, {adm_no:user.adm_no});
        setFeeDetails(feeDetailsRes.data);
        
        
        // Setting selected installment
        const installmentsWithValues = installmentsDropdownData.filter(i => totalNumberGenerator(feeDetailsRes.data?.heads?.filter(h => h?.amounts && (h.installment === i.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === i.label)?.map(a => Number(a.last_rec_amount === a.value ? 0 : a.payable_amount || a.value) !== 0)))));
        const selectedFilteredInstallment = installmentsWithValues.length === 0 ? {label:installmentsRes.data[0].name, value:installmentsRes.data[0].name.toLowerCase()} : installmentsWithValues[0];
        setSelectedInstallment(selectedFilteredInstallment);
        setTotalFee(totalNumberGenerator(feeDetailsRes.data?.heads?.filter(h => h?.amounts && (h.installment === selectedFilteredInstallment.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === selectedFilteredInstallment.label)?.map(a => Number(a.value))))));
        setReceivedFee(totalNumberGenerator(feeDetailsRes.data?.heads?.filter(h => h?.amounts && (h.installment === selectedFilteredInstallment.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === selectedFilteredInstallment.label)?.map(a => Number(a.last_rec_amount || 0))))));
        setDueFee(totalNumberGenerator(feeDetailsRes.data?.heads?.filter(h => h?.amounts && (h.installment === selectedFilteredInstallment.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === selectedFilteredInstallment.label)?.map(a => Number(a.last_rec_amount === a.value ? 0 : a.payable_amount || a.value))))));


        // Setting heads
        setPreviewHeads(feeDetailsRes.data.heads.filter(h => h?.amounts && (h.installment === selectedFilteredInstallment.label || h.installment === 'All installments')));


        // Setting loading to false
        setStates({...states, loadingData:false});

    };


    // Total number generator
    const totalNumberGenerator = numbers => {
        return numbers.reduce((acc, curr) => acc + curr, 0);
    };


    // Submit handler
    const submitHandler = async () => {
        setStates({...states, loading:true});
        try {


            // Creating new fee heads
            const unChangedHeads = feeDetails?.heads?.filter(h => !previewHeads.map(ph => ph.head_name).includes(h.head_name));
            const changedHeads = feeDetails?.heads?.filter(h => previewHeads.map(ph => ph.head_name).includes(h.head_name)).map(h => {
                return{
                    ...h,
                    amounts:h.amounts.filter(a => selectedInstallment.label === a.name).map(a => {
                        return{
                            name:a.name,
                            value:Number(a.value),
                            conc_amount:Number(a.conc_amount || 0),
                            paid_amount:0,
                            payable_amount:0,
                            last_rec_amount:Number(a.value) - Number(a.conc_amount || 0)
                        }
                    }).concat(h.amounts.filter(a => selectedInstallment.label !== a.name))
                }
            });
            const newHeads = [...unChangedHeads, ...changedHeads];
            const orderedNewHeads = newHeads.sort((a, b) => feeDetails?.heads?.findIndex(o => o.head_name === a.head_name) - feeDetails?.heads?.findIndex(o => o.head_name === b.head_name));

            // Updating student fee heads
            const headsLink = `${process.env.EXPO_PUBLIC_API_URL}/students/student/fee/pay`;
            await axios.post(headsLink, {adm_no:user.adm_no, new_heads:orderedNewHeads});


            // Creating payment
            const paymentHeads = feeDetails?.heads?.filter(h => previewHeads.map(ph => ph.head_name).includes(h.head_name)).map(h => {
                return{
                    ...h,
                    amounts:h.amounts.filter(a => selectedInstallment.label === a.name).map(a => {
                        return{
                            name:a.name,
                            value:Number(a.value),
                            conc_amount:Number(a.conc_amount || 0),
                            paid_amount:Number(a.value) - (Number(a.last_rec_amount || 0) + Number(a.conc_amount || 0)),
                            payable_amount:Number(a.value) - (Number(a.last_rec_amount || 0) + Number(a.conc_amount || 0)),
                            last_rec_amount:Number(a.last_rec_amount || 0)
                        }
                    })
                }
            });
            const paymentLink = `${process.env.EXPO_PUBLIC_API_URL}/payments/payment/create`;
            const params = {
                // School data
                school_name:school?.school_name || '',
                receipt_no:Math.floor(100000 + Math.random() * 900000),
                school_address:school?.school_address || '',
                website:school?.website || '',
                school_no:school?.school_no || '',
                affiliation_no:school?.affiliation_no || '',
                logo:school?.logo || '',
    
                // Student data
                student:user?.student?.name,
                class_name:user?.student?.class_name || '',
                adm_no:user?.adm_no || '',
                father_name:user?.parents?.father?.father_name || '',
                is_new:user?.student?.is_new || false,
                is_active:user?.student?.is_active || false,
                student_status:user?.student?.student_status || '',
    
                // Payment data
                installments:selectedInstallment.label,
                received_date:new Date(),
                fee_type:'All fee types',
                bank_name:'',
                fee_group:feeDetails.group_name,
                actual_amount:totalFee,
                paid_amount:dueFee,
                paid_heads:paymentHeads

            };
            await axios.post(paymentLink, params);


            // Reseting
            setVisible(true);
            setStates({...states, loading:false});
            fetchData();
    
        }catch(err){
            console.log(err);
        }
    };


    // Use effect
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={{height:'100%', alignItems:'center', gap:30}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push('/')}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Fee</Text>
                </View>
            </View>


            {/* Tabs */}
            <View style={{width:'80%', display:'flex', flexDirection:'row', borderRadius:100, backgroundColor:'#F5F5F8'}}>
                <TouchableOpacity
                    onPress={() => setSelectedTab('pay')}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'pay' ? '#fff' : 'gray', backgroundColor:selectedTab === 'pay' ? '#3C5EAB' : '#F5F5F8'}}>Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedTab('receipt');
                    }}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'receipt' ? '#fff' : 'gray', backgroundColor:selectedTab === 'receipt' ? '#3C5EAB' : '#F5F5F8'}}>Receipt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setSelectedTab('book')}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'book' ? '#fff' : 'gray', backgroundColor:selectedTab === 'book' ? '#3C5EAB' : '#F5F5F8'}}>Book</Text>
                </TouchableOpacity>
            </View>


            {/* Form */}
            <ScrollView style={{width:'100%'}} contentContainerStyle={{alignItems:'center'}}>
                <View style={{width:'90%', gap:20, paddingBottom:50}}>
                    {states.loadingData ? (
                        <ActivityIndicator />
                    ) : (
                        <>

                            {/* Card */}
                            <Card>
                                <View style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:2, paddingVertical:10, paddingHorizontal:20}}>

                                    {user.student.image ? (
                                        <Image
                                            source={{uri:user.student.image}}
                                            style={{height:100, width:100, borderRadius:4, borderWidth:1, borderColor:'#3C5EAB'}}
                                        />
                                    ) : (
                                        <View style={{width:100, height:100, alignItems:'center', justifyContent:'center', borderRadius:4, borderWidth:1, borderColor:'#3C5EAB'}}>
                                            <Text style={{fontWeight:'700', fontSize:11}}>No Image</Text>
                                        </View>
                                    )}


                                    <Text style={{fontSize:16, fontWeight:'600'}}>{user.student.name}</Text>


                                    <Text style={{fontSize:12}}>{user.adm_no}</Text>


                                    <Text style={{fontSize:12}}>Class - {user.student.class_name}</Text>


                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:6}}>
                                        <Text style={{fontSize:12, color:'#0094DA', marginLeft:2}}>Total Fee:</Text>
                                        <Text style={{fontSize:12, marginLeft:2, color:'gray'}}>₹{totalFee}</Text>
                                    </View>


                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                        <Text style={{fontSize:12, color:'#0094DA', marginLeft:2}}>Received Fee:</Text>
                                        <Text style={{fontSize:12, marginLeft:2, color:'gray'}}>₹{receivedFee}</Text>
                                    </View>


                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                        <Text style={{fontSize:12, color:'red', marginLeft:2}}>Due Fee:</Text>
                                        <Text style={{fontSize:12, marginLeft:2, color:'red'}}>₹{dueFee}</Text>
                                    </View>

                                </View>
                            </Card>


                            {/* Installment */}
                            <View style={{gap:6}}>
                                <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                    <Text>Installment</Text>
                                    <TouchableOpacity
                                        style={{paddingHorizontal:6, paddingVertical:2, borderRadius:4, backgroundColor:'#0094DA'}}
                                        onPress={() => setIsShowHeads(!isShowHeads)}
                                    >
                                        <Text style={{fontSize:12, color:'#fff'}}>
                                            {isShowHeads ? 'Hide' : 'Show'} Details
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Dropdown
                                    placeholderStyle={{color:'gray', paddingLeft:10}}
                                    selectedTextStyle={{paddingLeft:10}}
                                    data={installments}
                                    search
                                    activeColor='#ccc'
                                    labelField='label'
                                    valueField='value'
                                    placeholder='Select Installment'
                                    searchPlaceholder='Search...'
                                    value={selectedInstallment}
                                    onFocus={() => setOpenedField('installment')}
                                    onBlur={() => setOpenedField('')}
                                    onChange={item => installmentChangeHandler(item)}
                                    style={{backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'installment' ? 2 : 1, borderBottomColor:openedField === 'installment' ? '#0094DA' : 'gray'}}
                                    renderLeftIcon={() => (
                                        <Icon source='book-edit' color='gray' size={25}/>
                                    )}
                                />
                            </View>


                            {/* Heads */}
                            {isShowHeads && (
                                <View style={{display:'flex', flexDirection:'column', borderRadius:4, borderWidth:1, borderColor:'#ccc'}}>
                                    <View style={{display:'flex', flexDirection:'row', backgroundColor:'#3C5EAB', borderTopLeftRadius:4, borderTopRightRadius:4, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
                                        <Text style={{flex:1, textAlign:'center', color:'#fff', fontWeight:'600', paddingVertical:4, borderRightWidth:1, borderRightColor:'#ccc'}}>Fee Head</Text>
                                        <Text style={{flex:1, textAlign:'center', paddingVertical:4, color:'#fff', fontWeight:'600'}}>Amount</Text>
                                    </View>
                                    {previewHeads.map(h => (
                                        <View
                                            key={h.head_name}
                                            style={{display:'flex', flexDirection:'row', borderTopLeftRadius:4, borderTopRightRadius:4, borderBottomWidth:previewHeads.indexOf(h) !== previewHeads.length - 1 ? 1 : 0, borderBottomColor:'#ccc'}}
                                        >
                                            <Text style={{flex:1, textAlign:'center', paddingVertical:4, borderRightWidth:1, borderRightColor:'#ccc'}}>{h.head_name}</Text>
                                            <Text style={{flex:1, textAlign:'center', paddingVertical:4}}>₹{
                                                totalNumberGenerator(h?.amounts?.filter(a => a.name === selectedInstallment.label)?.map(a => Number(a.last_rec_amount === a.value ? 0 : a.payable_amount || a.value)))
                                            }</Text>
                                        </View>
                                    ))}
                                </View>
                            )}


                            {/* Button */}
                            {states.loading ? (
                                <ActivityIndicator />
                            ) : dueFee === 0 ? (
                                <Text style={{textAlign:'center', fontSize:16, fontWeight:'700', color:'green'}}>All Paid!</Text>
                            ) : (
                                <Button
                                    onPress={submitHandler}
                                    title='Pay Now'
                                />
                            )}

                            {/* Download Receipt */}
                            <PaperButton
                                style={{borderRadius:4, borderColor:'#0094DA'}}
                                mode='outlined'
                            >
                                Download Receipt
                            </PaperButton>

                        </>
                    )}
                </View>
            </ScrollView>



            {/* Snackbar */}
            <Snackbar
                style={{backgroundColor:'green'}}
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: <Icon source='close' color='#fff' size={20}/>,
                    onPress:() => setVisible(false)
                }}
            >
                Paid Successfully!
            </Snackbar>

        </View>
    );
};





// Export
export default index;