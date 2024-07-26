// Imports
import axios from 'axios';
import moment from 'moment';
import configs from '../../../../configs';
import {AuthContext} from '../../../../context/Auth';
import Icon from 'react-native-vector-icons/Ionicons';
import {useState, useEffect, useContext} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import EasebuzzCheckout from 'react-native-easebuzz-kit';
import {ActivityIndicator, Snackbar, Card, Switch} from 'react-native-paper';
import {Text, TouchableOpacity, View, ScrollView, Button, Image} from 'react-native';





// Main function
const index = ({navigation}) => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const onDismissSnackBar = () => setVisible(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    // User
    const {user, school} = useContext(AuthContext);


    // Selected tab
    const [selectedTab, setSelectedTab] = useState('pay');


    // Is show heads
    const [isShowHeads, setIsShowHeads] = useState(false);


    // Is all fee types
    const [isAllFeeTypes, setIsAllFeeTypes] = useState(true);


    // All installments
    const [allInstallments, setAllInstallments] = useState([]);


    // Is pay all installments
    const [isPayAllInstallments, setIsPayAllInstallments] = useState(false);


    // Is all installments paid
    const [isAllInstallmentsPaid, setIsAllInstallmentsPaid] = useState(false);


    // Last payment date
    const [lastPaymentDate, setLastPaymentDate] = useState(new Date());


    // Installment due on date
    const [installmentDueOnDate, setInstallmentDueOnDate] = useState('');


    // States
    const [states, setStates] = useState({
        loading:false,
        loadingData:false
    });


    // Opened dropdown
    const [openedField, setOpenedField] = useState('');


    // Fee details
    const [feeDetails, setFeeDetails] = useState();


    // Overdue by
    const [overDueBy, setOverDueBy] = useState(0);


    // Fee amounts
    const [totalFee, setTotalFee] = useState(0);
    const [receivedFee, setReceivedFee] = useState(0);
    const [dueFee, setDueFee] = useState(0);
    const [dueInstallmentFee, setDueInstallmentFee] = useState(0);
    const [previewHeads, setPreviewHeads] = useState([]);


    // Values
    const [selectedInstallment, setSelectedInstallment] = useState({label:'', value:''});
    const [feeTypes, setFeeTypes] = useState([]);
    const [selectedFeeType, setSelectedFeeType] = useState({label:'', value:''});


    // Fetch data
    const fetchData = async () => {

      // Setting loading data to true
      setStates({...states, loadingData:true});

      // Installments response
      const installmentsLink = `${configs.EXPO_PUBLIC_API_URL}/installments/names`;
      const installmentsRes = await axios.get(installmentsLink);
      setAllInstallments(installmentsRes.data);
      const installmentsDropdownData = installmentsRes.data.map(s => {
          return{
              label:s.name,
              value:s.name.toLowerCase(),
              due_on_date:s.due_on_date
          };
      });


      // Fee details response
      const feeDetailsLink = `${configs.EXPO_PUBLIC_API_URL}/students/student/fee`;
      const feeDetailsRes = await axios.post(feeDetailsLink, {adm_no:user.adm_no});
      setFeeDetails(feeDetailsRes.data);


      // Fee last date response
      const lastDateLink = `${configs.EXPO_PUBLIC_API_URL}/payments/payment/last-payment`;
      const lastDateRes = await axios.post(lastDateLink, {adm_no:user.adm_no});
      setLastPaymentDate(lastDateRes.data);
      
      
      // Setting selected installment
      const installmentsWithValues = installmentsDropdownData.filter(i => totalNumberGenerator(feeDetailsRes.data?.heads?.filter(h => h?.amounts && (h.installment === i.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === i.label)?.map(a => Number(a.last_rec_amount === a.value ? 0 : a.payable_amount || a.value) !== 0)))));
      if(installmentsWithValues.length === 0){
          setIsAllInstallmentsPaid(true);
          setStates({...states, loadingData:false});
          return;
      }else{

        const selectedFilteredInstallment = installmentsWithValues[0];
        setSelectedInstallment(selectedFilteredInstallment);
        setInstallmentDueOnDate(`${selectedFilteredInstallment.due_on_date.day} ${selectedFilteredInstallment.due_on_date.month}`);
        setTotalFee(totalNumberGenerator(feeDetailsRes.data?.heads?.map(h => totalNumberGenerator(h?.amounts?.map(a => Number(a.value))))));
        setReceivedFee(totalNumberGenerator(feeDetailsRes.data?.heads?.map(h => totalNumberGenerator(h?.amounts?.map(a => Number(a.last_rec_amount || 0))))));
        setDueFee(totalNumberGenerator(feeDetailsRes.data?.heads?.map(h => totalNumberGenerator(h?.amounts?.map(a => Number(a.last_rec_amount === a.value ? 0 : a.payable_amount || a.value))))));
        setDueInstallmentFee(totalNumberGenerator(feeDetailsRes.data?.heads?.filter(h => h?.amounts && (h.installment === selectedFilteredInstallment.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === selectedFilteredInstallment.label)?.map(a => Number(a.last_rec_amount === a.value ? 0 : a.payable_amount || a.value))))));
  
  
        // Setting heads
        setPreviewHeads(feeDetailsRes.data.heads.filter(h => h?.amounts && (h.installment === selectedFilteredInstallment.label || h.installment === 'All installments')));


        // Setting fee types
        const feeTypesDropdownData = feeDetailsRes.data.heads?.map(h => h.type_name).filter((type, index, self) => self.indexOf(type) === index).map(t => {
            return{
                label:t,
                value:t.toLowerCase()
            };
        });
        setFeeTypes(feeTypesDropdownData);


        // Fetching installment due on date
        const installmentDueOnDateLink = `${configs.EXPO_PUBLIC_API_URL}/installments/installment/due-on`;
        const installmentDueOnDateRes = await axios.post(installmentDueOnDateLink, {installment_name:selectedFilteredInstallment.label});
        

        // Difference in days between two dates
        const dateDifferenceInDays = (date1, date2) => {
            // Convert both dates to milliseconds
            const date1Millis = date1.getTime();
            const date2Millis = date2.getTime();
          
            // Calculate the difference in milliseconds
            const diffMillis = Math.abs(date1Millis - date2Millis);
          
            // Convert milliseconds to days
            const diffDays = Math.ceil(diffMillis / (1000 * 60 * 60 * 24));
          
            return diffDays;
        };
        setOverDueBy(dateDifferenceInDays(new Date(), new Date(installmentDueOnDateRes.data)));

      };


      // Setting loading to false
      setStates({...states, loadingData:false});

    };


    // Total number generator
    const totalNumberGenerator = numbers => {
      return numbers.reduce((acc, curr) => acc + curr, 0);
    };


    // Button click
    const buttonClick = async () => {
      try {

        // Setting is loading to true
        setStates({...states, loading:true});


        // Initiate payment api
        const initiatePaymentLink = `${configs.EXPO_PUBLIC_API_URL}/payments/payment/initiate-payment`;
        const easyCollectParams = {
          txnid:Math.floor(Math.random() * (100000000000000 - 1 + 1)) + 1,
          amount:isPayAllInstallments ? dueFee : dueInstallmentFee,
          productinfo:'info',
          firstname:user.student.name.trim(),
          phone:user.student.mobile || '0123456789',
          email:user.student.email
        };
        const easyCollectRes = await axios.post(initiatePaymentLink, easyCollectParams);


        // Easebuzz payment gateway
        var options = {
          access_key:easyCollectRes.data.data,
          pay_mode:'production'
        };
        EasebuzzCheckout.open(options).then(data => {
            if(data.result === 'payment_successfull'){
                submitHandler();
            }else{
                setSnackbarMessage('Payment Failed.');
                setVisible(true);
            }
        }).catch((error) => {
          setSnackbarMessage('Payment Failed.');
          setVisible(true);
        });


        // Setting is loading to false
        setStates({...states, loading:false});

      }catch(err){
          console.log(err);
      };
    };


    // Submit handler
    const submitHandler = async () => {
      setStates({...states, loading:true});
      try {


        if(isPayAllInstallments){
            // Creating new fee heads
            const changedHeads = feeDetails?.heads?.map(h => {
                return{
                    ...h,
                    amounts:h.amounts.map(a => {
                        return{
                        name:a.name,
                        value:Number(a.value),
                        conc_amount:Number(a.conc_amount || 0),
                        paid_amount:0,
                        payable_amount:0,
                        last_rec_amount:Number(a.value) - Number(a.conc_amount || 0)
                        }
                    })
                }
            });
            const orderedNewHeads = changedHeads.sort((a, b) => feeDetails?.heads?.findIndex(o => o.head_name === a.head_name) - feeDetails?.heads?.findIndex(o => o.head_name === b.head_name));
    
            // Updating student fee heads
            const headsLink = `${configs.EXPO_PUBLIC_API_URL}/students/student/fee/pay`;
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
            const paymentLink = `${configs.EXPO_PUBLIC_API_URL}/payments/payment/create`;
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
            setSnackbarMessage('Paid Successfully');
            setStates({...states, loading:false});
            fetchData();
        }else{
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
            const headsLink = `${configs.EXPO_PUBLIC_API_URL}/students/student/fee/pay`;
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
            const paymentLink = `${configs.EXPO_PUBLIC_API_URL}/payments/payment/create`;
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
              actual_amount:totalInstallmentFee,
              paid_amount:dueInstallmentFee,
              paid_heads:paymentHeads
    
            };
           await axios.post(paymentLink, params);
    
    
            // Reseting
            setVisible(true);
            setSnackbarMessage('Paid Successfully');
            setStates({...states, loading:false});
            fetchData();
        };
  
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
            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingVertical:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('student-tabs', {screen:'home'})}
                    >
                        <Icon name='arrow-back-outline' size={30} color='#fff'/>
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
                    {isAllInstallmentsPaid ? (
                        <>
                            <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8}}>
                                <Image
                                    style={{width:25, height:25}}
                                    source={require('../../../../assets/Fee/Success.png')}
                                />
                                <Text style={{color:'#28a745', fontSize:20}}>All Paid!</Text>
                            </View>
                            <View style={{display:'flex', flexDirection:'column', borderRadius:4, borderWidth:1, borderColor:'#ccc'}}>
                                <View style={{display:'flex', flexDirection:'row', backgroundColor:'#3C5EAB', borderTopLeftRadius:4, borderTopRightRadius:4, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
                                    <Text style={{flex:1, textAlign:'center', color:'#fff', fontWeight:'600', paddingVertical:4, borderRightWidth:1, borderRightColor:'#ccc'}}>Installment</Text>
                                    <Text style={{flex:1, textAlign:'center', paddingVertical:4, color:'#fff', fontWeight:'600'}}>Actual Amount</Text>
                                </View>
                                {allInstallments?.map(i => (
                                    <View
                                        key={i.name}
                                        style={{display:'flex', flexDirection:'row', borderTopLeftRadius:4, borderTopRightRadius:4, borderBottomWidth:1, borderBottomColor:'#ccc'}}
                                    >
                                        <Text style={{flex:1, textAlign:'center', paddingVertical:4, borderRightWidth:1, borderRightColor:'#ccc'}}>{i.name}</Text>
                                        <Text style={{flex:1, textAlign:'center', paddingVertical:4}}>₹{
                                            totalNumberGenerator(feeDetails.heads?.filter(h => h.installment === i.name || h.installment === 'All installments')?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === i.name)?.map(a => Number(a.value)))))
                                        }</Text>
                                    </View>
                                ))}
                                <View style={{display:'flex', flexDirection:'row', backgroundColor:'#3C5EAB', borderBottomLeftRadius:4, borderBottomRightRadius:4, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
                                    <Text style={{flex:1, textAlign:'center', color:'#fff', fontWeight:'600', paddingVertical:4, borderRightWidth:1, borderRightColor:'#ccc'}}>Total</Text>
                                    <Text style={{flex:1, textAlign:'center', paddingVertical:4, color:'#fff', fontWeight:'600'}}>₹{
                                        totalNumberGenerator(feeDetails.heads?.map(h => totalNumberGenerator(h?.amounts?.map(a => Number(a.value)))))
                                    }</Text>
                                </View>
                            </View>
                        </>
                    ) : states.loadingData ? (
                        <ActivityIndicator />
                    ) : (
                        <>

                            {/* Card */}
                            <Card>
                                <View style={{width:'100%', display:'flex', flexDirection:'column', gap:6, paddingVertical:10, paddingHorizontal:20}}>

                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:8}}>

                                        {user.student.image ? (
                                            <Image
                                                source={{uri:user.student.image}}
                                                style={{height:70, width:70, borderRadius:4, borderWidth:1, borderColor:'#3C5EAB'}}
                                            />
                                        ) : (
                                            <View style={{width:70, height:70, alignItems:'center', justifyContent:'center', borderRadius:4, borderWidth:1, borderColor:'#3C5EAB'}}>
                                                <Text style={{fontWeight:'700', fontSize:11}}>No Image</Text>
                                            </View>
                                        )}

                                        <View style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                                            <Text style={{fontSize:16, fontWeight:'600'}}>{user.student.name}</Text>
                                            <Text style={{fontSize:12, color:'gray'}}>{user.adm_no}</Text>
                                            <Text style={{fontSize:12, color:'gray'}}>Class - {user.student.class_name}</Text>
                                        </View>

                                    </View>

                                    <View style={{display:'flex', flexDirection:'column', gap:2}}>

                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:6}}>
                                                <Text style={{fontSize:12, color:'#0094DA', marginLeft:2}}>Total Fee:</Text>
                                                <Text style={{fontSize:12, marginLeft:2, color:'gray'}}>₹{totalFee}</Text>
                                            </View>


                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{fontSize:12, color:'#0094DA', marginLeft:2}}>Received Fee:</Text>
                                                <Text style={{fontSize:12, marginLeft:2, color:'gray'}}>₹{receivedFee}</Text>
                                            </View>
                                        </View>

                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{fontSize:12, color:'#0094DA', marginLeft:2}}>Due Fee:</Text>
                                                <Text style={{fontSize:12, marginLeft:2, color:'gray'}}>₹{dueFee}</Text>
                                            </View>

                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{fontSize:12, color:'#0094DA', marginLeft:2}}>Last Received On:</Text>
                                                <Text style={{fontSize:12, marginLeft:2, color:'gray'}}>{lastPaymentDate === 'No payments' ? '-' : moment(lastPaymentDate).format('D-M-YYYY')}</Text>
                                            </View>
                                        </View>

                                    </View>

                                </View>
                            </Card>


                            {/* Outstanding fee */}
                            <Card>
                                <View style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:6, paddingVertical:10, borderWidth:1, borderColor:'#ccc', borderBottomLeftRadius:10, borderBottomRightRadius:10, zIndex:2, backgroundColor:'#fff'}}>

                                    <Text style={{fontSize:30, fontWeight:'900'}}>₹{isPayAllInstallments ? dueFee : dueInstallmentFee}</Text>
                                    <Text style={{fontSize:12, color:'gray'}}>Total Outstanding Fee For {isPayAllInstallments ? 'All Installments' : selectedInstallment.label}</Text>

                                </View>
                                <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:-8, paddingHorizontal:20, paddingTop:10, paddingBottom:5, borderWidth:1, borderColor:'#ccc', borderBottomRightRadius:10, borderBottomLeftRadius:10, backgroundColor:'#fff'}}>
                                    <Text style={{color:'red', fontSize:12, width:'50%'}}>
                                        {!isPayAllInstallments && `Overdue by ${overDueBy} ${overDueBy === 1 ? 'day' : 'days'}`}
                                    </Text>
                                    <View style={{width:'50%', display:'flex', flexDirection:'row', alignItems:'center', marginTop:4}}>
                                        <Switch
                                            onChange={() => setIsPayAllInstallments(!isPayAllInstallments)}
                                            value={isPayAllInstallments}
                                        />
                                        <Text style={{fontSize:12}}>Pay All Installments</Text>
                                    </View>
                                </View>
                            </Card>


                            {/* Button */}
                            {states.loading ? (
                                <ActivityIndicator />
                            ) : (
                                <Button
                                    onPress={buttonClick}
                                    title='Pay Now'
                                />
                            )}


                            {/* Show details */}
                            <Card>
                                <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap:6, paddingVertical:10, paddingHorizontal:20}}>

                                    <View style={{flex:1, display:'flex', flexDirection:'column'}}>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:4}}>
                                            <Switch
                                                onChange={() => setIsAllFeeTypes(!isAllFeeTypes)}
                                                value={isAllFeeTypes}
                                            />
                                            <Text>All Fee Types</Text>
                                        </View>

                                        <Text style={{color:'#0094DA', fontWeight:'600'}}>Due on {installmentDueOnDate}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={{paddingHorizontal:6, paddingVertical:2, borderRadius:4, backgroundColor:'#0094DA'}}
                                        onPress={() => setIsShowHeads(!isShowHeads)}
                                    >
                                        <Text style={{fontSize:12, color:'#fff'}}>
                                            {isShowHeads ? 'Hide' : 'Show'} Details
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </Card>


                            {/* Fee Type */}
                            {!isAllFeeTypes && (
                                <View style={{gap:6}}>
                                    <Text>Fee Type</Text>
                                    <Dropdown
                                        placeholderStyle={{color:'gray', paddingLeft:10}}
                                        selectedTextStyle={{paddingLeft:10}}
                                        data={feeTypes}
                                        search
                                        activeColor='#ccc'
                                        labelField='label'
                                        valueField='value'
                                        placeholder='Select Fee Type'
                                        searchPlaceholder='Search...'
                                        value={selectedFeeType}
                                        onFocus={() => setOpenedField('fee-type')}
                                        onBlur={() => setOpenedField('')}
                                        onChange={item => setSelectedFeeType(item)}
                                        style={{backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'fee-type' ? 2 : 1, borderBottomColor:openedField === 'fee-type' ? '#0094DA' : 'gray'}}
                                        renderLeftIcon={() => (
                                            <Icon source='book-edit' color='gray' size={25}/>
                                        )}
                                    />
                                </View>
                            )}


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
                                            style={{display:'flex', flexDirection:'row', borderTopLeftRadius:4, borderTopRightRadius:4, borderBottomWidth:1, borderBottomColor:'#ccc'}}
                                        >
                                            <Text style={{flex:1, textAlign:'center', paddingVertical:4, borderRightWidth:1, borderRightColor:'#ccc'}}>{h.head_name}</Text>
                                            <Text style={{flex:1, textAlign:'center', paddingVertical:4}}>₹{
                                                totalNumberGenerator(h?.amounts?.filter(a => a.name === selectedInstallment.label)?.map(a => Number(a.last_rec_amount === a.value ? 0 : a.payable_amount || a.value)))
                                            }</Text>
                                        </View>
                                    ))}
                                    <View style={{display:'flex', flexDirection:'row', backgroundColor:'#3C5EAB', borderBottomLeftRadius:4, borderBottomRightRadius:4, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
                                        <Text style={{flex:1, textAlign:'center', color:'#fff', fontWeight:'600', paddingVertical:4, borderRightWidth:1, borderRightColor:'#ccc'}}>Total</Text>
                                        <Text style={{flex:1, textAlign:'center', paddingVertical:4, color:'#fff', fontWeight:'600'}}>₹{
                                            totalNumberGenerator(previewHeads?.map(h => totalNumberGenerator(h?.amounts?.map(a => Number(a.last_rec_amount === a.value ? 0 : a.payable_amount || a.value)))))
                                        }</Text>
                                    </View>
                                </View>
                            )}

                        </>
                    )}
                </View>
            </ScrollView>



            {/* Snackbar */}
            <Snackbar
                style={{backgroundColor:snackbarMessage === 'Paid Successfully' ? 'green' : 'red'}}
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                  label: <Icon name='close' color='#fff' size={20}/>,
                  onPress:() => setVisible(false)
                }}
            >
              {snackbarMessage}
            </Snackbar>

        </View>
    );
};





// Export
export default index;