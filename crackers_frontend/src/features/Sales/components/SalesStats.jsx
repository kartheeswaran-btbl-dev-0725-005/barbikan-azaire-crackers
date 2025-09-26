import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "../../../shared/components/ui/Card";

function SalesStats({ salesData }) {
    // const [totalCash, setTotalCash] = useState(0);
    // const [totalDigital, setTotalDigital] = useState(0);

    // useEffect(() => {
    //     const cashTotal = salesData.reduce((acc, curr) => acc + (curr.cash || 0), 0);
    //     const digitalTotal = salesData.reduce((acc, curr) => acc + (curr.digital || 0), 0);
    //     setTotalCash(cashTotal);
    //     setTotalDigital(digitalTotal);
    // }, [salesData]);

    const handleCash = () => {
        return salesData.reduce((acc, curr) => acc + (curr.cash || 0), 0).toLocaleString();
    };

    const handleDigital = () => {
        return salesData.reduce((acc, curr) => acc + (curr.digital || 0), 0).toLocaleString();
    };

    return (
        <>
            {salesData.map((stats, index) => (
                stats.fieldVal === "paymentValue" ? (
                    <Card key={index}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{stats.currentTimePeriod}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.sales}</div>
                            <p className="text-xs text-muted-foreground">₹{stats.amount?.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card key={index}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{stats.heading}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Cash:</span>
                                    <span>₹{handleCash()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Digital:</span>
                                    <span>₹{handleDigital()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            ))}
        </>
    );
}

export default SalesStats;
