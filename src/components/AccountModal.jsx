// // // Example: EditModal.js
// // import React, { useState } from "react";
// // import { Modal } from "react-bootstrap";
// // import {
// //     addDoc,
// //     collection,
// //     doc,
// //     getDoc,
// //     serverTimestamp,
// //     updateDoc,
// // } from "firebase/firestore";
// // import { db } from "../firebase";
// // import { toast } from "react-toastify";
// // import { updateUserById } from "../helper/firebaseHelpers";

// // const AccountModal = ({ onClose, show, selectedOrder, userProfile }) => {
// //     const [isPartial, setIsPartial] = useState(false);
// //     const [volume, setVolume] = useState(selectedOrder.volume);
// //     const [isLoading, setIsLoading] = useState(false);

// //     const closedPrice = selectedOrder?.currentPrice;

// //     const updateOrderStatus = async (orderId, newStatus, newVolume) => {
// //         const orderRef = doc(db, "orders", orderId);
// //         const docSnapshot = await getDoc(orderRef);

// //         const newData = {
// //             status: newStatus,
// //             closedDate: serverTimestamp(),
// //             closedPrice,
// //         };

// //         if (newVolume) {
// //             newData.volume = newVolume;
// //             newData.sum = newVolume * closedPrice;
// //         }

// //         let totalMargin = parseFloat(userProfile?.totalMargin);
// //         if (newVolume) {
// //             totalMargin = +(userProfile?.totalMargin - newData.sum).toFixed(2);
// //         } else {
// //             totalMargin = +(userProfile?.totalMargin - selectedOrder.sum).toFixed(2);
// //         }

// //         const userPayload = {
// //             totalBalance:
// //                 userProfile?.totalBalance + selectedOrder.profit - selectedOrder.swap,
// //             totalMargin,
// //             activeOrdersProfit: +parseFloat(
// //                 userProfile?.activeOrdersProfit - selectedOrder.profit
// //             ).toFixed(2),
// //             activeOrdersSwap: +parseFloat(
// //                 userProfile?.activeOrdersSwap - selectedOrder.swap
// //             )?.toFixed(2),
// //         };

// //         if (
// //             userProfile?.settings?.allowBonus &&
// //             userPayload.totalBalance < 0 &&
// //             userProfile.bonus - Math.abs(userPayload.totalBalance) >= 0
// //         ) {
// //             const spentBonus = Math.abs(userPayload.totalBalance);
// //             if (userProfile.bonus < spentBonus)
// //                 return toast.error("Not enough bonus to cover the loss");
// //             userPayload.totalBalance = userPayload.totalBalance + spentBonus;
// //             userPayload.bonus = +parseFloat(userProfile.bonus - spentBonus)?.toFixed(
// //                 2
// //             );
// //             userPayload.bonusSpent = +parseFloat(
// //                 userProfile.bonusSpent + spentBonus
// //             )?.toFixed(2);
// //         }

// //         newData.balance = +parseFloat(userPayload.totalBalance)?.toFixed(2);

// //         if (docSnapshot.exists()) {
// //             await updateDoc(orderRef, newData);
// //             await updateUserById(userProfile.id, userPayload);

// //             toast.success("Order status updated successfully");
// //         } else {
// //             toast.error("Order does not exist");
// //         }
// //     };

// //     const updateUserBalance = async (orderPrice) => {
// //         const userRef = doc(db, "users", selectedOrder.userId);
// //         const userSnapshot = await getDoc(userRef);
// //         if (userSnapshot.exists()) {
// //             const userData = userSnapshot.data();
// //             await updateDoc(userRef, {
// //                 totalBalance: userData?.totalBalance - orderPrice,
// //             });
// //         } else {
// //             toast.error("User not found");
// //         }
// //     };

// //     const createNewOrder = async () => {
// //         const formattedDate = new Date().toLocaleDateString("en-US");
// //         const newVolume = parseFloat(selectedOrder.volume) - parseFloat(volume);
// //         const newOrder1 = {
// //             ...selectedOrder,
// //             volume: newVolume,
// //             sum: newVolume * selectedOrder.symbolValue,
// //             profit: 0,
// //             createdTime: serverTimestamp(),
// //             createdAt: formattedDate,
// //             status: "Pending",
// //         };
// //         delete newOrder1.id;
// //         delete newOrder1.sltp;
// //         const orderRef = collection(db, "orders");
// //         await addDoc(orderRef, newOrder1);
// //     };

// //     const newOrder = async () => {
// //         if (isPartial) {
// //             if (
// //                 parseFloat(volume) <= 0 ||
// //                 parseFloat(volume) >= parseFloat(selectedOrder.volume)
// //             ) {
// //                 toast.error(
// //                     "Please add a volume which is less than the current volume"
// //                 );
// //             } else {
// //                 setIsLoading(true);
// //                 try {
// //                     await createNewOrder();
// //                     await updateOrderStatus(selectedOrder.id, "Closed", volume);
// //                     // const orderPrice = volume * closedPrice;
// //                     // await updateUserBalance(orderPrice);
// //                     onClose();
// //                 } catch (error) {
// //                     console.log(error);
// //                     toast.error(error.message);
// //                 }
// //                 setIsLoading(false);
// //             }
// //         } else {
// //             setIsLoading(true);
// //             try {
// //                 await updateOrderStatus(selectedOrder.id, "Closed");
// //                 // const orderPrice = volume * closedPrice;
// //                 // await updateUserBalance(orderPrice);
// //                 onClose();
// //             } catch (error) {
// //                 console.log(error);
// //                 toast.error(error.message);
// //             }
// //             setIsLoading(false);
// //         }
// //     };

// //     return (
// //         <>
// //             <Modal
// //                 show={show}
// //                 onHide={onClose}
// //                 className="modal-style-edit modal-style-del"
// //                 centered
// //             >
// //                 <Modal.Header
// //                     className="bg-transparent border-0 rounded-0 text-center p-1 pb-0 align-items-center"
// //                     closeButton
// //                 >
// //                     <p className="bg-transparent mb-0 w-100">
// //                         Create an account number:

// //                     </p>
// //                 </Modal.Header>
// //                 <Modal.Body className="bg-secondry d-flex flex-column gap-3 p-3 pt-0">
// //                     <div className="d-flex flex-column justify-content-start align-items-start gap-2">
// //                         <label
// //                             className="form-check-label fs-6 mb-2 ms-2"
// //                             for="flexRadioDefault1"
// //                         >
// //                             Type:
// //                         </label>
// //                         <div className="d-flex gap-4 fs-6 ">
// //                             <div className="form-check form-check-inline">
// //                                 <input
// //                                     class="form-check-input"
// //                                     type="radio"
// //                                     name="inlineRadioOptions"
// //                                     id="inlineRadio1"
// //                                     checked={!isPartial}
// //                                     onChange={(e) => {
// //                                         if (isPartial) setIsPartial(false);
// //                                     }}
// //                                 />
// //                                 <label class="form-check-label" for="inlineRadio1">
// //                                     Standard
// //                                 </label>
// //                             </div>
// //                             <div class="form-check form-check-inline">
// //                                 <input
// //                                     class="form-check-input"
// //                                     type="radio"
// //                                     name="inlineRadioOptions"
// //                                     id="inlineRadio2"
// //                                     checked={isPartial}
// //                                     onChange={(e) => {
// //                                         if (!isPartial) setIsPartial(true);
// //                                     }}
// //                                 />
// //                                 <label class="form-check-label" for="inlineRadio2">
// //                                     Islamic
// //                                 </label>
// //                             </div>
// //                         </div>
// //                     </div>
// //                     <div className="ps-3 fs-5">
// //                         Account Number:{" "}
// //                         <span className={`ms-2 text-success`}>30001</span>
// //                     </div>
// //                     <div className="w-100 text-center my-2">
// //                         <button
// //                             className="modal-close-btn btn btn-success fs-5 rounded-4 mx-auto"
// //                             onClick={() => {
// //                                 newOrder();
// //                             }}
// //                             disabled={isLoading}
// //                         >
// //                             Create
// //                         </button>
// //                     </div>
// //                 </Modal.Body>
// //             </Modal>
// //         </>
// //     );
// // };

// // export default AccountModal;


// import React, { useState } from "react";
// import { Modal } from "react-bootstrap";
// import { updateUserById } from "../helper/firebaseHelpers";

// const AccountModal = ({ onClose, show }) => {
//     const [isPartial, setIsPartial] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);

//     const newOrder = async () => {
//         setIsLoading(true);
//         // Simulate order creation
//         setTimeout(() => {
//             setIsLoading(false);
//             onClose();
//         }, 1000);
//     };

//     return (
//         <>
//             <Modal
//                 show={show}
//                 onHide={onClose}
//                 className="modal-style-edit modal-style-del"
//                 centered
//             >
//                 <Modal.Header
//                     className="bg-transparent border-0 rounded-0 text-center p-1 pb-0 align-items-center"
//                     closeButton
//                 >
//                     <p className="bg-transparent mb-0 w-100">
//                         Create an account number:
//                     </p>
//                 </Modal.Header>
//                 <Modal.Body className="bg-secondry d-flex flex-column gap-3 p-3 pt-0">
//                     <div className="d-flex flex-column justify-content-start align-items-start gap-2">
//                         <label
//                             className="form-check-label fs-6 mb-2 ms-2"
//                             htmlFor="flexRadioDefault1"
//                         >
//                             Type:
//                         </label>
//                         <div className="d-flex gap-4 fs-6">
//                             <div className="form-check form-check-inline">
//                                 <input
//                                     className="form-check-input"
//                                     type="radio"
//                                     name="inlineRadioOptions"
//                                     id="inlineRadio1"
//                                     checked={!isPartial}
//                                     onChange={() => setIsPartial(false)}
//                                 />
//                                 <label className="form-check-label" htmlFor="inlineRadio1">
//                                     Standard
//                                 </label>
//                             </div>
//                             <div className="form-check form-check-inline">
//                                 <input
//                                     className="form-check-input"
//                                     type="radio"
//                                     name="inlineRadioOptions"
//                                     id="inlineRadio2"
//                                     checked={isPartial}
//                                     onChange={() => setIsPartial(true)}
//                                 />
//                                 <label className="form-check-label" htmlFor="inlineRadio2">
//                                     Islamic
//                                 </label>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="ps-3 fs-5">
//                         Account Number:{" "}
//                         <span className={`ms-2 text-success`}>30001</span>
//                     </div>
//                     <div className="w-100 text-center my-2">
//                         <button
//                             className="modal-close-btn btn btn-success fs-5 rounded-4 mx-auto"
//                             onClick={newOrder}
//                             disabled={isLoading}
//                         >
//                             Create
//                         </button>
//                     </div>
//                 </Modal.Body>
//             </Modal>
//         </>
//     );
// };

// export default AccountModal;

// AccountModal.jsx
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { updateUserById, fetchLastAccountNo, updateLastAccountNo, getUserData } from "../helper/firebaseHelpers";

const AccountModal = ({ onClose, show, currentUserId }) => {
    const [user, setUser] = useState(null);
    const [accountType, setAccountType] = useState("Standard");
    const [isLoading, setIsLoading] = useState(false);
    const [lastAccountNo, setLastAccountNo] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserData(currentUserId);
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Handle error, maybe show a toast or alert
            }
        };

        const fetchLastAccount = async () => {
            try {
                const lastAccount = await fetchLastAccountNo();
                console.log("lastAccount", lastAccount)
                setLastAccountNo(lastAccount);
            } catch (error) {
                console.error("Error fetching last account number:", error);
                // Handle error, maybe show a toast or alert
            }
        };

        fetchUserData();
        fetchLastAccount();
    }, [currentUserId]);

    // const newOrder = async () => {
    //     setIsLoading(true);
    //     try {
    //         if (lastAccountNo === null || user === null) {
    //             throw new Error("Last account number or user data not fetched");
    //         }

    //         // Increment lastAccountNo to get the new accountNumber
    //         const newAccountNumber = lastAccountNo + 1;

    //         // Update user data with the new accountNumber
    //         const userPayload = {
    //             // Assuming user data structure and field names
    //             accounts: [
    //                 ...user.accounts,
    //                 {
    //                     accountType: accountType,
    //                     accountNumber: newAccountNumber,
    //                     active: false
    //                 }
    //             ]
    //         };

    //         // Update user data in Firebase
    //         await updateUserById(user.id, userPayload);

    //         // Update lastAccountNo in the "Configs" collection
    //         await updateLastAccountNo(newAccountNumber);

    //         // Close the modal after updating user data
    //         onClose();
    //     } catch (error) {
    //         console.error("Error creating account:", error);
    //         // Handle error, maybe show a toast or alert
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const newAccount = async () => {
        setIsLoading(true);
        try {
            console.log("Creating new account...");

            if (lastAccountNo === null || user === null) {
                throw new Error("Last account number or user data not fetched");
            }

            console.log("Last account number:", lastAccountNo);
            console.log("User data:", user);

            // Check if the 'accounts' array exists in user data
            if (!user || !user.accounts) {
                // If 'accounts' array doesn't exist, initialize it as an empty array
                user = { ...user, accounts: [] };
            }

            // Check if the user can create a new account
            if (user.accounts.length >= 2) {
                throw new Error("User cannot create more than 2 accounts");
            }

            console.log("Creating new account...");

            // Increment lastAccountNo to get the new accountNumber
            const newAccountNumber = lastAccountNo + 1;

            console.log("New account number:", newAccountNumber);

            // Update user data with the new account
            const newAccount = {
                accountType: accountType,
                accountNumber: newAccountNumber,
                active: false
            };

            const updatedUserAccounts = [...user.accounts, newAccount];

            // Update user data in Firebase
            console.log("Updating user data with new account...");
            await updateUserById(user.id, { accounts: updatedUserAccounts });

            // Update lastAccountNo in the "Configs" collection
            console.log("Updating last account number...");
            await updateLastAccountNo(newAccountNumber);

            console.log("Account creation successful.");

            // Close the modal after updating user data
            onClose();
        } catch (error) {
            console.error("Error creating new account:", error);
            // Handle error, maybe show a toast or alert
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <Modal
                show={show}
                onHide={onClose}
                className="modal-style-edit modal-style-del"
                centered
            >
                <Modal.Header
                    className="bg-transparent border-0 rounded-0 text-center p-1 pb-0 align-items-center"
                    closeButton
                >
                    <p className="bg-transparent mb-0 w-100">
                        Create an account number:
                    </p>
                </Modal.Header>
                <Modal.Body className="bg-secondry d-flex flex-column gap-3 p-3 pt-0">
                    <div className="d-flex flex-column justify-content-start align-items-start gap-2">
                        <label
                            className="form-check-label fs-6 mb-2 ms-2"
                            htmlFor="flexRadioDefault1"
                        >
                            Type:
                        </label>
                        <div className="d-flex gap-4 fs-6">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    id="inlineRadio1"
                                    checked={accountType === "Standard"}
                                    onChange={() => setAccountType("Standard")}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio1">
                                    Standard
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    id="inlineRadio2"
                                    checked={accountType === "Islamic"}
                                    onChange={() => setAccountType("Islamic")}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio2">
                                    Islamic
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ps-3 fs-5">
                        Account Number:{" "}
                        <span className={`ms-2 text-success`}>{lastAccountNo !== null ? lastAccountNo + 1 : "Loading..."}</span>
                    </div>
                    <div className="w-100 text-center my-2">
                        <button
                            className="modal-close-btn btn btn-success fs-5 rounded-4 mx-auto"
                            onClick={newAccount}
                            disabled={isLoading}
                        >
                            Create
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AccountModal;
