import { EventEmitter } from "events";
import winston from "winston";

// export a singleton instance of EventEmitter
export const eventEmitter = new EventEmitter();

// export event listeners to ensure they are ready before emitting events in the main application
export function events() {

    eventEmitter.on("notifications:subscription_created", (subscription: any) => {

        const end_date = new Intl.DateTimeFormat("en", {
            year: "numeric",
            month: "long",
            day: "2-digit",
        }).format(subscription.end_date);

        const emailMessage = `
--------------------------------------------------------------------
- Hello #${subscription.UserId},                                   
--------------------------------------------------------------------
-  
- You have successfully subscribed to Magazine #${subscription.MagazineId}.
- Your subscription will expire on ${end_date}.
-
- Best Regards,
- Magazine Hun Team
--------------------------------------------------------------------`;
        //send email
        winston.silly(emailMessage);
    });
}
