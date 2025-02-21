import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { message } from "antd";
import { MdDelete } from "react-icons/md";
import AXIOS from "axios";
import { useNavigate } from "react-router-dom";

export default function Myorder() {
    const nav = useNavigate();
    const userid = sessionStorage.getItem("userid");
    const [record, setRecord] = useState([]);

    useEffect(() => {
        AXIOS.get(`http://localhost:9000/getAllOrderbyuserid/${userid}`)
            .then((res) => {
                setRecord(res.data);
            })
            .catch((err) => message.error(err));
    }, [userid]);

    const payProcess = (orderid) => {
        sessionStorage.setItem("orderid", orderid);
        AXIOS.post(`http://localhost:9000/paymentprocess/${orderid}`)
            .then((res) => {
                message.success(res.data);
                nav("/emppage/paymentpages");
            })
            .catch((err) => message.error(err));
    };

    const deleteProduct = (orderid) => {
        let ans = window.confirm("Do you want to delete?");
        if (ans) {
            const url = `http://localhost:9000/deleteorder/${orderid}`;
            AXIOS.get(url)
                .then((res) => {
                    alert(res.data);
                    setRecord(record.filter((item) => item._id !== orderid));
                })
                .catch((err) => message.error("Error deleting order"));
        } else {
            alert("Delete is cancelled");
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product Detail</th>
                                <th>Order Detail</th>
                                <th>Action</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {record.map((ls) => (
                                <tr key={ls._id}>
                                    <td>
                                        <img
                                            src={`http://localhost:9000/${ls.pid.image}`}
                                            style={{ width: "100px", height: "95px" }}
                                            className="rounded"
                                            alt="Product"
                                        />
                                        <h4>Product Name: {ls.pid.productname}</h4>
                                        <h5>Category: {ls.pid.category}</h5>
                                        <h5>Seller: {ls.sellerid.fullname}</h5>
                                        <h6>&#8377;{ls.pid.productprice}</h6>
                                    </td>
                                    <td>
                                        <h5>Total Quantity: {ls.prodquantity}</h5>
                                        <h5>Address: {ls.address}</h5>
                                        <hr />
                                        <h5>Create Date: {new Date(ls.createdAt).toLocaleString()}</h5>
                                    </td>
                                    <td>
                                        <MdDelete
                                            onClick={() => deleteProduct(ls._id)}
                                            style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
                                        />
                                    </td>
                                    <td>
                                        {ls.status === "nill" ? (
                                            <button
                                                className="btn btn-info"
                                                onClick={() => payProcess(ls._id)}
                                            >
                                                Payment
                                            </button>
                                        ) : (
                                            <span className="text-success">Paid</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}
