import {
    IAppAccessors,
    IAppInstallationContext,
    IConfigurationExtend,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { notionCommand } from './commands/notionCommands';
import { IAuthData, IOAuth2Client, IOAuth2ClientOptions } from '@rocket.chat/apps-engine/definition/oauth2/IOAuth2';
import { createOAuth2Client } from '@rocket.chat/apps-engine/definition/oauth2/OAuth2';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { isUserHighHierarchy, sendDirectMessage } from './lib/message';

export class NotionApp extends App {
    private readonly appLogger: ILogger
    public botUsername: string;
    public botUser: IUser;
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors)
        // we assign the logger to the appLogger variable
        this.appLogger = this.getLogger()
        // we call the log function        
        // this.appLogger.debug('Hello, World!')
    }

    //Auth logic 
    // public async authorizationCallback(
    //     token: IAuthData,
    //     user: IUser,
    //     read: IRead,
    //     modify: IModify,
    //     http: IHttp,
    //     persistence: IPersistence,

    // ) {
    //     this.appLogger.debug(token)

    // }

    // public oauth2ClientInstance: IOAuth2Client;
    // private oauth2Config: IOAuth2ClientOptions = {
    //     alias: 'notion',
    //     accessTokenUri: 'https://api.notion.com/v1/oauth/token',
    //     authUri: 'https://api.notion.com/v1/oauth/authorize',
    //     refreshTokenUri: 'https://api.notion.com/v1/oauth/token',
    //     revokeTokenUri: 'https://api.notion.com/v1/oauth/revoke',
    //     authorizationCallback: this.authorizationCallback.bind(this),
    // }
    // public getOauth2ClientInstance(): IOAuth2Client {
    //     if (!this.oauth2ClientInstance) {
    //         this.oauth2ClientInstance = createOAuth2Client(
    //             this,
    //             this.oauth2Config
    //         );
    //     }
    //     return this.oauth2ClientInstance;
    // }


    public async extendConfiguration(
        configuration: IConfigurationExtend
    ): Promise<void> {
        const notioncommand: notionCommand = new notionCommand()
        await configuration.slashCommands.provideSlashCommand(notioncommand)
        // await createOAuth2Client(this, this.oauth2Config).setup(configuration)
        // this.getOauth2ClientInstance().setup(configuration)
        // await createOAuth2Client(this, this.config).getAccessTokenForUser(this.user);

    }

    public async onEnable(): Promise<boolean> {
        this.botUsername = 'clickup-app.bot';
        this.botUser = (await this.getAccessors()
            .reader.getUserReader()
            .getByUsername(this.botUsername)) as IUser;
        return true;
    }

    public async onInstall(
        context: IAppInstallationContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<void> {
        const user = context.user;

        // const quickReminder = 'Quick reminder: Let your workspaces users know about the  App,\
        //                     so everyone will be able to manage their tasks/workspaces as well.\n';


        const text =
            `Welcome to the Notion Rocket.Chat App!\n` +
            `You can easily Create or Update your Notion Pages,Database etc. \n` +
            `start by completing the app's setup  andauthorizing your Notion account.\n` +
            `To do so, type  \`/notion auth\`\n`
            //  +`${isUserHighHierarchy(user) ? quickReminder : ''}`
            ;

        await sendDirectMessage(read, modify, user, text, persistence);
    }
}



