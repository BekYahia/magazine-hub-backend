import { EventEmitter } from "events";
import winston from "winston";
import config from "../config";

// export a singleton instance of EventEmitter
export const eventEmitter = new EventEmitter();

// export event listeners to ensure they are ready before emitting events in the main application
export function events() {

    eventEmitter.on("notifications:subscription_created", (subscription: any) => {

        const emailMessage = `
--------------------------------------------------------------------
- Hello #${subscription.UserId},
--------------------------------------------------------------------
-
- You have successfully subscribed to Magazine #${subscription.MagazineId}.
- Your subscription will expire on ${subscription.end_date}.
-
- Best Regards,
- Magazine Hun Team
--------------------------------------------------------------------`;

        //send email
        winston.silly(config.node_env === 'test' ? 'Notifications: subscription_created' : emailMessage)
    });
}
