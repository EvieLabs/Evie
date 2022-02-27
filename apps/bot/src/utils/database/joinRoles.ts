import { Guild, Role, Snowflake } from "discord.js";
import { prisma } from ".";
import { Success } from "../../types";

export async function isJoinRoleOn(guild: Guild): Promise<boolean> {
  try {
    const result = await prisma.guildsettings.findFirst({
      where: {
        serverid: guild.id,
      },
    });
    return result?.joinRoleEnabled || false;
  } catch (error) {
    return false;
  }
}

export async function getJoinRole(guild: Guild): Promise<Snowflake | null> {
  try {
    const result = await prisma.guildsettings.findFirst({
      where: {
        serverid: guild.id,
      },
    });
    return result?.joinRoleID || null;
  } catch (error) {
    return false || null;
  }
}

export async function setJoinRole(guild: Guild, role: Role): Promise<boolean> {
  try {
    const result = await prisma.guildsettings.update({
      where: {
        serverid: guild.id,
      },
      data: {
        joinRoleID: role.id,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function setJoinRoleEnable(
  guild: Guild,
  enable: boolean
): Promise<Success> {
  try {
    const result = await prisma.guildsettings.update({
      where: {
        serverid: guild.id,
      },
      data: {
        joinRoleEnabled: enable,
      },
    });
    return {
      success: true,
      message: "Join role enabled successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
